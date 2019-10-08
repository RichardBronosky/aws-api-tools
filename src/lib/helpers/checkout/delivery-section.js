import { store } from '../../../redux/store'
import {
  setOrder,
  setDeliveryCalendar as setDeliveryCalendarRedux,
  setDeliveryInvalidFields,
} from '../../../redux/modules/checkout'
import { getStore, getStoreHours } from '../store-locator'
import { months, weekdays, getStandardTime } from '../string-helper'
import { getOrder } from './global'
import { getDateFull } from '..//date'
import { reportToSentry } from './global'
import { updateDelivery } from '../../services/checkout'

export const getDistributionCenter = order => {
  const store = getStore(order)
  if (store && store.pickup_hours) {
    return {
      distributionCenter: {
        name: `${ store.city } Distribution Center`,
        hours: getStoreHours(store.pickup_hours),
      },
    }
  }
}

export const getDeliverySliderIndex = (selectedDate, dates) => {
  let index = 0
  if (dates.filter(date => date.isExpressDelivery).length > 0) {
    if (1 < dates.filter(date => date.isStandardDelivery).findIndex(date => date.readable === selectedDate.readable)) {
      index = dates.filter(date => date.isStandardDelivery).findIndex(date => date.readable === selectedDate.readable)
    }
  }
  return index
}

export const getDeliverySpecificBody = (order, isPickup) => {
  let deliveryType = 'U'
  const lineItems = order.lineItems
  for (let i = 0, n = lineItems.length; i < n; i++) {
    if (lineItems[i].deliveryType === 'D' || lineItems[i].deliveryType === 'K') {
      deliveryType = 'D'
    }
  }
  let body = {
    orderId: order.orderId,
    additionalDirections: order.additionalDirections,
    shouldCombineUPSWithTruck: true,
    deliveryType,
    isPickup: isPickup === false ? false : isPickup === true || order.isPickup,
  }
  if (deliveryType === 'D') {
    body.deliveryDate = order.deliveryDate
  }
  return body
}

export const setDeliveryInfo = (info, field) => {
  let order = getOrder()
  order = {
    ...order,
    [field]: info,
  }
  store.dispatch(setOrder(order))
}

export const setDeliveryCalendar = (deliveryCalendar, pickupCalendar, expressDelivery, setCalendar = true) => {
  let calendar = []
  if (expressDelivery && expressDelivery !== '') {
    const expressDate = new Date(expressDelivery).setHours(new Date(expressDelivery).getHours() + 6)
    calendar.push({
      date: expressDelivery,
      readable: `${ months[Number(expressDelivery.substr(5, 2)) - 1] } ${ expressDelivery.substr(8, 2) }`,
      dayOfWeek: weekdays[new Date(expressDate).getDay()].substr(0, 3),
      isPickup: false,
      isStandardDelivery: true,
      isExpressDelivery: true,
    })
  }
  for (let i = 0, n = deliveryCalendar.length; i < n; i++) {
    const date = new Date(deliveryCalendar[i]).setHours(new Date(deliveryCalendar[i]).getHours() + 6)
    calendar.push({
      date: deliveryCalendar[i],
      readable: `${ months[Number(deliveryCalendar[i].substr(5, 2)) - 1] } ${ deliveryCalendar[i].substr(8, 2) }`,
      dayOfWeek: weekdays[new Date(date).getDay()].substr(0, 3),
      isPickup: false,
      isStandardDelivery: true,
      isExpressDelivery: false,
    })
  }
  if (pickupCalendar) {
    for (let i = 0, n = pickupCalendar.length; i < n; i++) {
      const date = new Date(pickupCalendar[i]).setHours(new Date(pickupCalendar[i]).getHours() + 6)
      const index = calendar.findIndex(date => date.date === pickupCalendar[i])
      if (index !== -1) {
        calendar[index].isPickup = true
      } else {
        calendar.push({
          date: pickupCalendar[i],
          readable: `${ months[Number(pickupCalendar[i].substr(5, 2)) - 1] } ${ pickupCalendar[i].substr(8, 2) }`,
          dayOfWeek: weekdays[new Date(date).getDay()].substr(0, 3),
          isPickup: true,
          isStandardDelivery: false,
          isExpressDelivery: false,
        })
      }
    }
  }
  calendar.sort((a, b) => {
    if (a.date < b.date) {
      return -1
    }
    if (a.date > b.date) {
      return 1
    }
    return 0
  })
  setCalendar && store.dispatch(setDeliveryCalendarRedux(calendar))
  return calendar
}

export const getRoomsToGoDeliveryItems = lineItems => {
  let deliveryItems = []
  for (let i = 0, n = lineItems.length; i < n; i++) {
    if ((lineItems[i].deliveryType === 'D' || lineItems[i].deliveryType === 'K') && lineItems[i].sku !== '99999925') {
      deliveryItems.push(lineItems[i])
    }
  }
  return deliveryItems
}

export const getVendorDeliveryItems = lineItems => {
  let deliveryItems = []
  for (let i = 0, n = lineItems.length; i < n; i++) {
    if (lineItems[i].deliveryType === 'O') {
      deliveryItems.push(lineItems[i])
    }
  }
  return deliveryItems
}

export const getUPSDeliveryItems = lineItems => {
  let deliveryItems = []
  for (let i = 0, n = lineItems.length; i < n; i++) {
    if (lineItems[i].deliveryType === 'U') {
      deliveryItems.push(lineItems[i])
    }
  }
  return deliveryItems
}

export const getUSPSDeliveryItems = lineItems => {
  let deliveryItems = []
  for (let i = 0, n = lineItems.length; i < n; i++) {
    if (lineItems[i].deliveryType === 'T') {
      deliveryItems.push(lineItems[i])
    }
  }
  return deliveryItems
}

export const getDeliveryDate = (order, deliveryCalendar, pickup = false) => {
  if (order && deliveryCalendar) {
    let deliveryDate
    if (order.deliveryDate) {
      if ((order.isPickup && pickup) || (!order.isPickup && !pickup)) {
        deliveryDate = deliveryCalendar.filter(date => date.date === order.deliveryDate)[0]
      } else if (!order.isPickup && pickup) {
        deliveryDate = deliveryCalendar.filter(date => date.isPickup)[0]
      } else {
        deliveryDate = deliveryCalendar.filter(date => date.isStandardDelivery && !date.isExpressDelivery)[0]
      }
    } else if (pickup) {
      deliveryDate = deliveryCalendar.filter(date => date.isPickup)[0]
    } else {
      deliveryDate = deliveryCalendar.filter(date => date.isStandardDelivery && !date.isExpressDelivery)[0]
    }
    if (deliveryCalendar.length > 0 && deliveryDate) {
      let storedDate = deliveryCalendar[0]
      let expressDate
      if (order.isPickup) {
        storedDate = deliveryCalendar.filter(date => date.isPickup)[0]
      } else {
        const expressDates = deliveryCalendar.filter(date => date.isExpressDelivery)
        expressDate = expressDates.length > 0 ? expressDates[0] : null
        storedDate = deliveryCalendar.filter(date => date.isStandardDelivery && !date.isExpressDelivery)[0]
      }
      const selectedDate = deliveryDate.date
      if (deliveryDate.readable !== '' && selectedDate >= ((expressDate && expressDate.date) || storedDate.date)) {
        return {
          readable: deliveryDate.readable,
          date: selectedDate,
        }
      }
      return {
        readable: storedDate.readable,
        date: storedDate.date,
      }
    }
    return {
      readable: 'No delivery dates avaliable.',
      date: new Date().toISOString().split('T')[0],
    }
  }
}

export const getDistributionCenterHours = (order, date) => {
  const thisDate = new Date(date.date).setHours(new Date(date.date).getHours() + 6)
  const day = weekdays[new Date(thisDate).getDay()]
  if (order) {
    const location = getStore(order)
    if (location && day) {
      const pickup_hours = location.pickup_hours
      const dayHours = {
        openTime: pickup_hours[`${ day.toLowerCase() }Open`],
        closeTime: pickup_hours[`${ day.toLowerCase() }Closed`],
      }
      if (dayHours && dayHours.openTime)
        return `${ getStandardTime(dayHours.openTime) }-${ getStandardTime(dayHours.closeTime) }`.toUpperCase()
    }
  }
  return ''
}

export const getDistributionDaysClosed = order => {
  if (order) {
    let daysClosed = []
    for (let i = 0, n = weekdays.length; i < n; i++) {
      const store = getStore(order)
      if (store) {
        const pickup_hours = store.pickup_hours
        if (pickup_hours && !pickup_hours[`${ weekdays[i].toLowerCase() }Open`]) {
          daysClosed.push(weekdays[i].substr(0, 3))
        }
      }
    }
    if (daysClosed.length === 1) {
      return daysClosed[0]
    } else if (daysClosed.length === 2) {
      return `${ daysClosed[0] } and ${ daysClosed[1] }`
    } else {
      let str = ''
      for (let i = 0, n = daysClosed.length; i < n; i++) {
        if (i === n - 1) str = str + `and ${ daysClosed[i] }`
        else str = str + `${ daysClosed[i] }, `
      }
      return str
    }
  }
}

export const getDeliverySectionData = (order, deliveryCalendar) => {
  let rtgDeliveryItems = []
  let vendorDeliveryItems = []
  let upsDeliveryItems = []
  let uspsDeliveryItems = []
  if (order && order.lineItems) {
    rtgDeliveryItems = getRoomsToGoDeliveryItems(order.lineItems)
    vendorDeliveryItems = getVendorDeliveryItems(order.lineItems)
    upsDeliveryItems = getUPSDeliveryItems(order.lineItems)
    uspsDeliveryItems = getUSPSDeliveryItems(order.lineItems)
  }
  const deliveryDate =
    (order && order.deliveryDate) ||
    (deliveryCalendar.length > 0 &&
      deliveryCalendar.filter(date => date.isStandardDelivery && !date.isExpressDelivery)[0].date)
  const isExpress =
    deliveryCalendar.length > 0 &&
    deliveryDate &&
    `${ deliveryDate }` &&
    deliveryCalendar.filter(day => day.isExpressDelivery).length > 0 &&
    deliveryCalendar.filter(day => day.isExpressDelivery)[0].date === deliveryDate.toString().substr(0, 10)
  let fullDeliveryDate
  if (deliveryDate) {
    fullDeliveryDate = getDateFull(new Date(deliveryDate))
  }
  return {
    rtgDeliveryItems,
    vendorDeliveryItems,
    uspsDeliveryItems,
    upsDeliveryItems,
    isExpress,
    fullDeliveryDate,
  }
}

export const validateDeliveryStep = async (nextStep, skip = false) => {
  let invalidFields = []
  if (nextStep === 'review') {
    invalidFields = ['payment incomplete']
  }
  if (invalidFields.length < 1 && nextStep === 'payment') {
    let order = getOrder()
    const delOrder = await updateDelivery(getDeliverySpecificBody(order)).catch(err => {
      reportToSentry(err, order, 'updateDelivery', skip ? 'delivery section skipped' : 'continue button click')
      invalidFields = ['buttonClick']
    })
    if (delOrder) {
      store.dispatch(setOrder(delOrder))
    } else {
      invalidFields = ['buttonClick']
    }
  }
  store.dispatch(setDeliveryInvalidFields(invalidFields))
  return invalidFields
}

export const canSkipDelivery = async () => {
  const order = getOrder()
  const rtgDeliveryItems = getRoomsToGoDeliveryItems(order.lineItems)
  if (rtgDeliveryItems.length < 1) {
    await validateDeliveryStep('payment', true)
    return true
  }
  return false
}
