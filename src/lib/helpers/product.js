import { getRegionZone, getCurrentLocation } from './geo-location'
import { fetchProductWarehouseAvailability } from '../services/product'
import { months } from './string-helper'
import { saveLocalStorage, getFromBrowserStorage } from './storage'
import { fetchProductBySku } from '@services/product'
import giftCardImage from '@assets/images/gift-cards.jpg'

export function productAvailability(product) {
  if (product) {
    const region = getRegionZone().region
    if (product.catalog_availability && region && product.delivery_type !== 'O' && product.delivery_type !== 'U') {
      return product.catalog_availability[region]
    } else if (product.delivery_type === 'O' || product.delivery_type === 'U') {
      return true
    }
  }
  return false
}

export const weeksBetween = (date1, date2) => {
  const ONE_WEEK = 1000 * 60 * 60 * 24 * 7
  const difference_ms = Math.abs(date1.getTime() - date2.getTime())
  return Math.floor(difference_ms / ONE_WEEK)
}

export const daysBetween = (date1, date2) => {
  const ONE_DAY = 24 * 60 * 60 * 1000
  const difference_ms = Math.abs(date1.getTime() - date2.getTime())
  return Math.floor(difference_ms / ONE_DAY)
}

export function productPrice(product, strikethrough = false, region = null, zone = null) {
  const rtg_location = getRegionZone()
  if (product && rtg_location) {
    if (product.pricing) {
      let priceString = region ? `${ region }_${ zone }` : `${ rtg_location.region }_${ rtg_location.zone }`
      let price =
        product.pricing[priceString + '_sale_price'] && !strikethrough
          ? product.pricing[priceString + '_sale_price']
          : product.pricing[priceString + '_list_price']
      return price ? price : product.pricing.default_price
    } else {
      let price =
        product['zone_' + rtg_location.zone + '_sale_price'] && !strikethrough
          ? product['zone_' + rtg_location.zone + '_sale_price']
          : product['zone_' + rtg_location.zone + '_list_price']
      return price ? price : product.default_price ? product.default_price : product.price
    }
  }
}

export function productOnSale(product) {
  if (product) {
    const rtg_location = getRegionZone()
    if (rtg_location) {
      return product.on_sale
        ? product.on_sale[`${ rtg_location.region }_${ rtg_location.zone }`]
        : product[`zone_${ rtg_location.zone }_on_sale`]
    }
    return false
  }
}

export const isProductStrikeThrough = product => {
  const location = getCurrentLocation()
  if (location) {
    const regionZone = `${ location.region }`
    return (
      product.strikethrough &&
      ((typeof product.strikethrough[regionZone] !== 'undefined' && product.strikethrough[regionZone] !== false) ||
        product.strikethrough === true) &&
      ((product.pricing &&
        product.pricing[`${ location.region }_${ location.price_zone }_list_price`] !==
          product.pricing[`${ location.region }_${ location.price_zone }_sale_price`]) ||
        product[`zone_${ location.price_zone }_sale_price`] !== product[`zone_${ location.price_zone }_list_price`] ||
        product.price !== product.list_price)
    )
  }
}

// Memoization Example
export const getRegionSkuList = (function() {
  let cache = {}
  return (list, region) => {
    const key = JSON.stringify([list, region])
    if (!cache[key]) {
      if (list) {
        if (region === 'FL' && list.FL) {
          cache[key] = list.FL
        }
        if (region === 'SE' && list.SE) {
          cache[key] = list.SE
        }
        if (region === 'TX' && list.TX) {
          cache[key] = list.TX
        }
        if (region === 'OOM' && list.OOM) {
          cache[key] = list.OOM
        }
      }
    }
    return cache[key]
  }
})()

export const getStockMessage = (product, setStockMessage) => {
  const rtg_location = getCurrentLocation()
  if (
    rtg_location &&
    product &&
    product.sku !== '83333333' &&
    (rtg_location.region !== 'OOM' ||
      ((product.delivery_type === 'O' || product.delivery_type === 'U') && rtg_location.region === 'OOM'))
  ) {
    fetchProductWarehouseAvailability(product.sku, rtg_location.distribution_index, rtg_location.state)
      .then(data => {
        availabilityStockMessage(data, product, rtg_location, setStockMessage)
      })
      .catch(() => setStockMessage('Out of stock'))
  } else if (
    product &&
    product.delivery_type !== 'O' &&
    product.delivery_type !== 'U' &&
    rtg_location &&
    rtg_location.region === 'OOM'
  ) {
    setStockMessage('Not available in your region')
  } else {
    setStockMessage('In stock')
  }
}

export const availabilityStockMessage = (data, product, rtg_location, setStockMessage = null) => {
  let stockMessage
  const today = new Date()
  const availableDate = new Date(data.data.earliestAvailability)
  const weeks = weeksBetween(today, availableDate)
  const days = daysBetween(today, availableDate)
  const shipCostCode = product.shipping_cost_code ? product.shipping_cost_code[rtg_location.region] : ''
  if (
    data.data.earliestAvailability === '9999-12-31T00:00:00.000Z' ||
    data.data.earliestAvailability === '9999-12-31T00:00:00.000Z'
  ) {
    stockMessage = 'Discontinued'
  } else if (data.data.earliestAvailability === '2999-12-31T00:00:00.000Z') {
    stockMessage = 'Available Soon'
  } else if (product.delivery_type === 'O' || product.delivery_type === 'U') {
    if (availableDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)) {
      stockMessage = `Ships direct from vendor. Item available after ${
        months[availableDate.getMonth()]
      } ${ availableDate.getDate() }, Allow 7 to 10 days to ship.`
    } else if (shipCostCode === 'LT') {
      stockMessage = `The carrier will contact you directly to schedule your delivery, which includes placing box into the first room of your home.`
    } else if (shipCostCode === 'ITEM' && product.delivery_type === 'O') {
      stockMessage = `Ships direct from vendor. Allow 4-6 weeks for delivery.`
    } else if (shipCostCode === 'UD') {
      stockMessage = `Ships via UPS. Allow 7-10 days for delivery.`
    } else if (shipCostCode === 'UDR') {
      stockMessage = `Ships via UPS, usually within a week.`
    } else if (shipCostCode === 'VD23') {
      stockMessage = `Ships direct from vendor. Allow 2-3 weeks for delivery.`
    } else if (shipCostCode === 'VD35') {
      stockMessage = `Ships direct from vendor. Usually within a week.`
    } else if (shipCostCode === 'VD71') {
      stockMessage = `Ships direct from vendor, usually within 7 to 10 business days.`
    } else if (shipCostCode === 'VDEX') {
      stockMessage = `Ships direct from vendor, usually within 2 to 3 business days.`
    } else if (shipCostCode === 'VDR') {
      stockMessage = `Ships direct from vendor, usually within a week.`
    } else {
      stockMessage = `${ product.delivery_type === 'U' ? 'ships via UPS' : 'shipping directly from vendor' }`
    }
  } else {
    if (weeks > 8) {
      if (days > 120) {
        stockMessage = 'Usually available in 4-6 months.'
      } else {
        stockMessage = 'Usually available in 2-4 months.'
      }
    } else if (weeks >= 4) {
      stockMessage = 'Usually available in 4-8 weeks.'
    } else if (weeks >= 2) {
      stockMessage = 'Usually available in 2-4 weeks.'
    } else if (weeks >= 1) {
      stockMessage = 'Usually available in 1-2 weeks.'
    } else {
      stockMessage = 'In stock'
    }
  }
  if (product.customer_assembly_required) {
    stockMessage = `${ stockMessage } Customer Assembly Required.`
  }
  if (setStockMessage && stockMessage) {
    setStockMessage(stockMessage)
  } else if (setStockMessage && !stockMessage) {
    setStockMessage('Out of Stock')
  }
  return stockMessage
}

export const getRequiredAddon = requiredAddons => {
  let requiredAddon
  if (requiredAddons) {
    let title,
      decline,
      price = 0,
      skus = []
    for (let i = 0, n = requiredAddons.length; i < n; i++) {
      title =
        i > 0
          ? `${ title } and ${ requiredAddons[i].title }${
              requiredAddons[i].quantity > 1 ? ` (${ requiredAddons[i].quantity })` : ''
            }`
          : `${ requiredAddons[i].title }${ requiredAddons[i].quantity > 1 ? ` (${ requiredAddons[i].quantity })` : '' }`
      decline = i > 0 ? `${ decline } and ${ requiredAddons[i].title }` : `${ requiredAddons[i].title }`
      price += productPrice(requiredAddons[i]) * requiredAddons[i].quantity
      skus.push(requiredAddons[i].sku)
    }
    requiredAddon = {
      title: title,
      price: price,
      skus: skus,
      decline: decline,
    }
  }
  return requiredAddon
}

export const isActiveAddon = (activeAddons, addonSku) => {
  return activeAddons ? activeAddons.some(activeAddon => activeAddon.sku === addonSku) : false
}

export const savePageScroll = () => {
  if (
    window.location.pathname.includes('/furniture') ||
    window.location.pathname.includes('/mattress') ||
    window.location.pathname.includes('/search')
  ) {
    saveLocalStorage('rtg_scroll', {
      scrollY: window.scrollY,
      pathForScroll: window.location.pathname,
    })
  }
}

export const scrollToPLP = () => {
  let rtg_scroll = getFromBrowserStorage('local', 'rtg_scroll')
  if (rtg_scroll && rtg_scroll.scrollY && rtg_scroll.pathForScroll) {
    if (window.location.pathname === rtg_scroll.pathForScroll) {
      window.scrollTo(0, rtg_scroll.scrollY)
    } else {
      saveLocalStorage('rtg_scroll', {})
    }
  }
}

export const fetchProductOrGC = sku => {
  if (sku === '83333333') {
    return new Promise(resolve => resolve(getGiftCardProductData()))
  } else {
    return fetchProductBySku(sku)
  }
}

export const getGiftCardProductData = () => ({
  sku: '83333333',
  delivery_type: 'T',
  price: 100,
  unitPrice: 100,
  title: 'Gift Card',
  primary_image: giftCardImage,
  grid_image: giftCardImage,
  category: 'gift-card',
  catalog: 'gift-card',
  pricing: { default_price: 100 },
})
