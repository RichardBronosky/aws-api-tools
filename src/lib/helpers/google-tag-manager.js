import uuidv4 from 'uuid/v4'
import { getCurrentLocation } from './geo-location'
import { getCart, getProductsFromCart } from './cart'
import { browserName, browserVersion } from 'react-device-detect'
import { getSessionId } from './cloudfront'
import { productPrice, productOnSale, productAvailability } from './product'
import * as Sentry from '@sentry/browser'
import Cookies from 'universal-cookie'
import { saveLocalStorage, getFromBrowserStorage } from './storage'
import { distinct } from './string-helper'

const cookies = new Cookies()

export const clearDataLayer = () => {
  if (window && window.google_tag_manager) {
    window.google_tag_manager['GTM-WH7CJC9'].dataLayer.reset()
  }
}

export const setupAnalytics = (options = {}) => {
  if (window && typeof window !== 'undefined' && window.dataLayer) {
    // Persisted Values
    const getOriginalLocation = window.dataLayer.find(o => o.originalLocation)
    const originalLocation = getOriginalLocation
      ? getOriginalLocation.originalLocation
      : document.location.protocol +
        '//' +
        document.location.hostname +
        document.location.pathname +
        document.location.search
    const localUserID = getFromBrowserStorage('local', 'uuid')
    const userID = localUserID ? localUserID : saveLocalStorage('uuid', uuidv4())
    const userData = {
      id: userID,
      sessionId: getSessionId(),
      type: 'customer',
      productType: 'furniture',
      location: getCurrentLocation(),
      browser: { name: browserName, version: browserVersion },
      environment: process.env.GATSBY_ENV_SHORT,
    }
    const analyticsProducts = []
    const cart = getCart()
    if (cart) {
      for (let item in cart.cartItems) {
        let cartItem = cart.cartItems[item]
        if (cartItem && cartItem.activeAddons) {
          cartItem.product.active_addons = cartItem.activeAddons
        }
        analyticsProducts.push(analyticsProduct(cartItem.product, cartItem.quantity, item))
      }
    }
    const user = { user: userData, cart: { products: analyticsProducts } }
    const pageData = { event: 'pageData', page: options.pageData, originalLocation: originalLocation }

    // Set Data Layer for GTM
    clearDataLayer()
    window.dataLayer.push(user)
    window.dataLayer.push(pageData)
    Sentry.configureScope(scope => {
      scope.setExtra('user', user)
      scope.setExtra('page', options.pageData)
      scope.setExtra('cookies', cookies.getAll())
    })
  }
}

export const addToDataLayer = (event, category, action, label, value) => {
  if (window) {
    window.dataLayer.push({
      event: event,
      interaction: {
        category: category,
        action: action,
        label: label,
        value: value,
      },
    })
  }
}

export const trackImpression = (inView, contentIndex, content) => {
  if (inView && window && content.__typename === 'ContentfulBanner') {
    window.dataLayer.push({
      event: 'ee_promoView',
      ecommerce: { promoView: { contentIndex: contentIndex, banner: content.name || content.title } },
    })
  }
}

export const analyticsProduct = (product, quantity, position) => {
  if (product) {
    return {
      title: product.title,
      sku: product.sku,
      price: productPrice(product),
      unitPrice: product.unitPrice,
      quantity: product.quantity || quantity,
      position: position,
      brand: product.brand,
      catalog: product.catalog,
      category: product.category,
      sub_category: product.sub_category,
      generic_name: product.generic_name,
      gaCategory: `${ product.catalog }/${ product.category }/${ product.sub_category }/${ product.generic_name ||
        product.title }`,
      collection: product.collection,
      delivery_type: product.delivery_type,
      type: product.type,
      room_type_code: product.room_type_code,
      piececount: product.piececount,
      sell_individually: product.sell_individually,
      single_item_room: product.single_item_room,
      free_shipping: product.free_shipping,
      on_sale: productOnSale(product),
      availability: productAvailability(product),
      dimensions: product.dimensions,
      decor: product.decor,
      style: product.style,
      color_family: product.color_family,
      material_family: product.material_family,
      finish_family: product.finish_family,
      movement: product.movement,
      size: product.size,
      age: product.age,
      gender: product.gender,
      primary_image: product.primary_image,
      active_addons: product.active_addons,
      addon_items: product.addon_items,
      variations: product.variations,
      upgrade_items: product.upgrade_items,
      room_configurations: product.room_configurations,
      package_skus: product.package_skus,
    }
  } else {
    return null
  }
}

export const getPaymentTypesForAnalytics = order => {
  let paymentTypes = []
  if (order.paymentInfo && order.paymentInfo.length > 0) {
    const cc = order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')
    const rtg = order.paymentInfo.filter(payment => payment.paymentType === 'FIN')
    const pp = order.paymentInfo.filter(payment => payment.paymentType === 'PALV2')
    const visa = order.paymentInfo.filter(payment => payment.paymentType === 'VISA')
    const aff = order.paymentInfo.filter(payment => payment.paymentType === 'AFF')
    const gc = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
    if (cc.length > 0) {
      paymentTypes.push({
        type: 'Credit Card',
        amount: cc[0].authorizedAmount,
      })
    }
    if (rtg.length > 0) {
      paymentTypes.push({
        type: 'RTG Financing',
        amount: rtg[0].authorizedAmount,
      })
    }
    if (pp.length > 0) {
      paymentTypes.push({
        type: 'PayPal',
        amount: pp[0].authorizedAmount,
      })
    }
    if (visa.length > 0) {
      paymentTypes.push({
        type: 'Visa Checkout',
        amount: visa[0].authorizedAmount,
      })
    }
    if (aff.length > 0) {
      paymentTypes.push({
        type: 'Affirm',
        amount: aff[0].authorizedAmount,
      })
    }
    if (gc.length > 0) {
      let gcAmount = 0
      for (let i = 0; i < gc.length; i++) {
        gcAmount += gc[i].authorizedAmount
      }
      paymentTypes.push({
        type: 'Gift Cards',
        amount: gcAmount,
      })
    }
  }
  return paymentTypes
}

export const getProductCatalogs = products => {
  let catalogList = []
  for (let product in products) {
    catalogList.push(products[product]['catalog'])
  }
  return catalogList.filter(distinct)
}

export const setupCheckoutAnalytics = async cart => {
  setupAnalytics({ pageData: { type: 'checkout', title: 'Checkout', path: '/checkout' } })
  const analyticsProducts = await getAnalyticsProducts(cart)
  window.dataLayer.push({ event: 'ee_checkout', ecommerce: { checkout: { products: analyticsProducts } } })
  checkoutStepAnalytics('shipping')
}

export const checkoutStepAnalytics = (nextStep, deliverySkip) => {
  const checkoutSteps = ['shipping', 'delivery', 'payment', 'review']
  if (deliverySkip) {
    window.dataLayer.push({
      event: 'ee_checkout_option',
      ecommerce: {
        checkout_option: {
          step: checkoutSteps.indexOf('delivery') + 1,
        },
      },
    })
  }
  window.dataLayer.push({
    event: 'ee_checkout_option',
    ecommerce: {
      checkout_option: {
        step: checkoutSteps.indexOf(nextStep) + 1,
      },
    },
  })
}

export const getAnalyticsProducts = async cart => {
  cart = cart || getCart()
  const cartItems = cart && cart.cartItems
  const products = await getProductsFromCart(cart)
  return products.map(p => {
    const index = cartItems.findIndex(item => item.sku === p.sku)
    if (cartItems && cartItems[index] && cartItems[index].activeAddons && cartItems[index].activeAddons.length > 0) {
      p['active_addons'] = cartItems[index].activeAddons.map(a => analyticsProduct(a, a.quantity || 1))
    }
    const quantity = p.quantity ? p.quantity * cartItems[index].quantity : cartItems[index].quantity
    return analyticsProduct(p, quantity, index)
  })
}

export const placeOrderAnalytics = async order => {
  const analyticsProducts = await getAnalyticsProducts()
  const paymentTypes = getPaymentTypesForAnalytics(order)
  window.dataLayer.push({
    event: 'ee_purchase',
    ecommerce: {
      purchase: {
        id: order.orderId,
        catalog: getProductCatalogs(analyticsProducts),
        revenue: order.total - order.tax - order.totalDeliveryCharge,
        tax: order.tax,
        shipping: order.totalDeliveryCharge,
        deliveryDate: order.deliveryDate,
        region: getCurrentLocation().region,
        shippingState: order.shippingAddress.state,
        paymentTypes: paymentTypes,
        products: analyticsProducts,
      },
    },
  })
}
