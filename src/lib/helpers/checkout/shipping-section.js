import { navigate } from 'gatsby'
import { getOrder, setOrderInfo } from './global'
import { store } from '../../../redux/store'
import {
  setOrder,
  setShippingInvalidFields,
  setCheckoutStepsCompleted,
  setCheckoutStep,
} from '../../../redux/modules/checkout'
import { setLocation } from '../../../redux/modules/location'
import { abbreviateState, getCurrentLocation } from '../geo-location'
import { validateEmail, validatePhone, validateZip } from '../string-helper'
import { checkProductRegionAvailability, verifyAndUpdateCart } from '../cart'
import { reportToSentry, checkManualAddress } from './global'
import { updateAddress, fetchAddressLookup } from '../../services/checkout'
import { getLocation } from '../../services/location'
import { getCart } from '../cart'
import { setBillingAddressInfo } from './payment-section/billing-address'
import { announce, taskDone } from '../aria-announce'

const noSaleStates = ['CA', 'AK', 'HI', 'PR']

export const setContactInfo = (info, field) => {
  let order = getOrder()
  order = {
    ...order,
    contact: {
      ...order.contact,
      [field]: info,
    },
  }
  store.dispatch(setOrder(order))
}

export const setShippingAddressInfo = (info, field = null) => {
  let order = getOrder()
  if (info.state) {
    info.state = abbreviateState(info.state)
  } else if (field === 'state') {
    info = abbreviateState(info)
  }
  if (field) {
    order = {
      ...order,
      shippingAddress: {
        ...order.shippingAddress,
        [field]: info,
      },
    }
  } else {
    order = {
      ...order,
      shippingAddress: {
        ...order.shippingAddress,
        ...info,
      },
    }
  }
  store.dispatch(setOrder(order))
}

export const validateShippingStep = async nextStep => {
  let order = getOrder()
  let invalidFields = []
  if (nextStep === 'payment') {
    invalidFields = ['delivery incomplete']
  }
  if (nextStep === 'review') {
    invalidFields = ['payment incomplete']
  }
  const entries = Object.entries(Object.assign({}, order.contact, order.shippingAddress))
  for (let i = 0, n = entries.length; i < n; i++) {
    const entryKey = entries[i][0]
    const entryData = entries[i][1]
    if (
      (entryData === '' || entryData === null) &&
      entryKey !== 'address2' &&
      entryKey !== 'altPhone' &&
      entryKey !== 'country_code' &&
      entryKey !== 'plus4' &&
      entryKey !== 'county' &&
      entryKey !== 'addressLookup'
    ) {
      if (entryKey === 'address1') {
        invalidFields.push('street')
      } else {
        invalidFields.push(entryKey)
      }
    } else {
      if (entryKey === 'email') {
        !validateEmail(entryData) && invalidFields.push('email')
      }
      if (entryKey === 'phone') {
        !validatePhone(entryData) && invalidFields.push('phone')
      }
      if (entryKey === 'altPhone' && entryData !== '') {
        !validatePhone(entryData) && invalidFields.push('alternatePhone')
      }
      if (entryKey === 'zip') {
        !validateZip(entryData) && invalidFields.push('zip')
      }
      if (order.shippingAddress.showAddressLookup && entryKey === 'addressLookupSuccess') {
        ;(!entryData || entryData === null) && invalidFields.push('addressLookup')
      }
    }
  }
  if (order.shippingAddress.showAddressLookup) {
    invalidFields = invalidFields.filter(entry => entry !== 'address1')
    invalidFields = invalidFields.filter(entry => entry !== 'city')
    invalidFields = invalidFields.filter(entry => entry !== 'state')
    invalidFields = invalidFields.filter(entry => entry !== 'zip')
  } else {
    invalidFields = await checkManualAddress(order, invalidFields)
  }
  if (invalidFields.length < 1) {
    let available = await checkShippingZip(
      order.shippingAddress.addressLookupSuccess
        ? order.shippingAddress.addressLookup.slice(-5)
        : order.shippingAddress.zip,
      true,
      getCart()
    )
    if (available) {
      const addrOrder = await updateAddress(getAddressSpecificBody(order)).catch(err => {
        reportToSentry(err, order, 'updateAddress', 'continue button click')
        invalidFields = ['buttonClick']
      })
      if (addrOrder) {
        store.dispatch(setOrder({ ...checkOrderDeliveryDate(addrOrder), acceptManual: false }))
      } else {
        invalidFields = ['buttonClick']
      }
    }
  }
  store.dispatch(setShippingInvalidFields(invalidFields))
  return invalidFields
}

export const checkOrderDeliveryDate = order => {
  if (
    (order.deliveryCalendar && !order.deliveryCalendar.includes(order.deliveryDate) && !order.isPickup) ||
    (order.pickupCalendar && !order.pickupCalendar.includes(order.deliveryDate) && order.isPickup)
  ) {
    order.deliveryDate = order.deliveryCalendar[0]
    order.isPickup = false
  }
  return order
}

export const getAddressSpecificBody = (order, billing = false) => {
  const location = getCurrentLocation()
  const zipParts = order.shippingAddress.zip.split('-')
  let body = {
    orderId: order.orderId,
    shippingAddress: {
      ...order.shippingAddress,
      county: location ? location.county : 'U',
      country_code: 'US',
      zip: zipParts[0],
      plus4: zipParts[1],
    },

    contact: {
      ...order.contact,
      phone: order.contact.phone.replace(/\D+/g, ''),
      altPhone: order.contact.altPhone && order.contact.altPhone.replace(/\D+/g, ''),
    },
    deliveryTexts: order.deliveryTexts,
    emailCampaign: order.emailCampaign,
    distributionIndex: location && parseInt(location.distribution_index),
  }
  if (billing) {
    body = {
      ...body,
      billingAddress: {
        ...order.billingAddress,
        county: location ? location.county : 'U',
        country_code: 'US',
      },
      payer: {
        ...order.payer,
      },
    }
  }
  return body
}

export const checkShippingZip = async zipIn => {
  let data = await getLocation(zipIn)
  if (data && data.response) {
    const location = getCurrentLocation()
    if (['California', 'Arkansas', 'Hawaii', 'Puerto Rico'].includes(data.response.state.trim())) {
      alert('We apologize, but we are currently unable to sell to Alaska, California, Hawaii, or Puerto Rico.')
      return false
    } else if (
      location.region !== data.response.region ||
      location.delivery_zone !== data.response.delivery_zone ||
      location.price_zone !== data.response.price_zone ||
      location.state !== data.response.state
    ) {
      store.dispatch(setLocation(data.response))
      verifyAndUpdateCart(getCart())
    }
    const notAvailable = await checkProductRegionAvailability(data.response.region)
    if (notAvailable.length) {
      store.dispatch(setCheckoutStepsCompleted({ shipping: false, delivery: false, payment: false }))
      if (
        !alert(
          'We apologize, but some items are out of stock or unavailable for purchase in the specified zip code. Please review your cart and make changes as necessary.'
        )
      ) {
        store.dispatch(setCheckoutStep('shipping'))
        navigate('/cart')
        return false
      }
    }
  }
  return true
}

export const setAddress = async (address, billing = false) => {
  if (address !== 'No matches.') {
    let addressArr = address.split(',')
    const address1 = addressArr[0]
    addressArr = addressArr[1].split(' ')
    let city = ''
    for (let i = 1; i < addressArr.length - 2; i++) {
      city = city + ' ' + addressArr[i]
    }
    city = city.trim()
    const zipArr = addressArr[addressArr.length - 1].split('-')
    billing
      ? setBillingAddressInfo({
          addressLookup: address,
          addressLookupSuccess: true,
          address1,
          city,
          state: addressArr[addressArr.length - 2],
          zip: zipArr[0],
          plus4: zipArr[1],
        })
      : setShippingAddressInfo({
          addressLookup: address,
          addressLookupSuccess: true,
          address1,
          city,
          state: addressArr[addressArr.length - 2],
          zip: zipArr[0],
          plus4: zipArr[1],
        })
  } else {
    setShippingAddressInfo(false, 'showAddressLookup')
  }
}

export const onAddressLookupChange = (event, setAddressItems) => {
  event.preventDefault()
  const address = event.target.value
  setShippingAddressInfo({
    addressLookup: address,
    addressLookupSuccess: false,
  })
  let addressItems = []
  fetchAddressLookup(address)
    .then(data => {
      if (data.results && data.results.length > 0) {
        data.results.forEach((result, index) => {
          addressItems.push({
            id: index,
            label: result.suggestion,
          })
        })
        addressItems.push({
          id: 'no results',
          label: '',
        })
        announceResults(data.results.length, address)
      } else {
        addressItems.push({
          id: 'no results',
          label: 'No matches.',
        })
        announceResults(0, address)
      }
      setAddressItems(addressItems)
    })
    .catch(() => {
      if (address.length > 0) {
        addressItems.push({
          id: 'error',
          label: 'No matches.',
        })
      }
      announceResults(0, address)
      setAddressItems(addressItems)
    })
}

export const onAddressLookupSelect = selected => {
  if (selected !== 'No matches.' && selected !== '') {
    const addressArr = selected.split(',')[1].split(' ')
    const state = addressArr[addressArr.length - 2]
    if (noSaleStates.includes(state)) {
      alert('We apologize, but we are currently unable to sell to Alaska, California, Hawaii, or Puerto Rico.')
    } else {
      setAddress(selected)
    }
  }
}

export const onClickChangeAddress = event => {
  event.preventDefault()
  if (event.target && event.target.className && event.target.className === 'change-address-btn') {
    setShippingAddressInfo({
      addressLookup: '',
      showAddressLookup: true,
      addressLookupSuccess: false,
    })
  }
}

export const onStateChange = event => {
  if (event.target.value !== 'none') {
    if (noSaleStates.includes(event.target.value)) {
      alert('We apologize, but we are currently unable to sell to Alaska, California, Hawaii, or Puerto Rico.')
    } else {
      setShippingAddressInfo(event.target.value, 'state')
    }
  }
}

export const onMenuVisibilityChange = (addressItems, setAddressItems) => {
  if (addressItems.length === 0) {
    setAddressItems([
      {
        id: 'no results',
        label: 'No matches.',
      },
    ])
  }
}

export const announceResults = (results, address) => {
  taskDone(
    () => {
      if (results > 0) {
        announce('Displaying ' + (results + 1) + ' Results for "' + address + '"')
      } else {
        announce('No Matches. Press Tab to enter address manually.')
      }
    },
    350,
    'announceResultsCount'
  )
}

export const addressItemsFocus = (items, _autocomplete) => {
  if (items.length == 0) {
    _autocomplete._ignoreFocus = true
    _autocomplete.setState({
      highlightedIndex: null,
      isOpen: false,
    })
    _autocomplete.refs.input.select()
    _autocomplete.refs.input.setAttribute('aria-activedescendant', '')
  }
}

export const checkPlus4 = order => {
  if (order.shippingAddress && order.shippingAddress.plus4) {
    order.shippingAddress.zip = `${ order.shippingAddress.zip }-${ order.shippingAddress.plus4 }`
    order.shippingAddress.plus4 = null
    setOrderInfo(order.shippingAddress, 'shippingAddress')
  }
  if (order.billingAddress && order.billingAddress.plus4) {
    order.billingAddress.zip = `${ order.billingAddress.zip }-${ order.billingAddress.plus4 }`
    order.billingAddress.plus4 = null
    setOrderInfo(order.billingAddress, 'billingAddress')
  }
}
