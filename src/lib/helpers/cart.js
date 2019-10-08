import { fetchProductBySku, fetchProductWarehouseAvailability } from '../services/product'
import { productPrice, productOnSale, availabilityStockMessage, fetchProductOrGC } from './product'
import { store } from '../../redux/store'
import { setOrder, setCheckoutStep } from '../../redux/modules/checkout'
import {
  addProductToCart,
  updateCartProductQuantity,
  removeProductFromCart,
  setCart,
  addActiveAddon,
  removeActiveAddon as removeActiveAddonRedux,
} from '../../redux/modules/cart'
import { analyticsProduct, addToDataLayer } from './google-tag-manager'
import { saveLocalStorage, getFromBrowserStorage } from './storage'
import { taskDone, announce } from './aria-announce'
import { clearCheckoutState, getOrder, getLineItems } from './checkout/global'
import { getRegionZone, getCurrentLocation } from './geo-location'
import { createOrder, getOrder as fetchOrder, updateLineItems } from '../services/checkout'

export const getCart = () => {
  return store.getState().cart.cart
}

export const fetchAndAddActiveAddon = (product, cartIndex, addon) => {
  fetchProductBySku(addon.sku).then(fetchedAddon =>
    store.dispatch(addActiveAddon(product.sku, { ...fetchedAddon, quantity: addon.quantity }, cartIndex))
  )
}

export const removeActiveAddon = (product, addonSku, cartIndex) => {
  store.dispatch(removeActiveAddonRedux(product.sku, addonSku, cartIndex))
}

export const getLineItemQuantity = () => {
  let count = 0
  let count2 = 0
  const cart = getCart()
  if (cart && cart.cartItems && cart.cartItems.length > 0) {
    for (let i = 0, n = cart.cartItems.length; i < n; i++) {
      count += parseInt(cart.cartItems[i].quantity)
      if (cart.cartItems[i].activeAddons) {
        for (let x = 0, y = cart.cartItems[i].activeAddons.length; x < y; x++) {
          count += parseInt(cart.cartItems[i].quantity * cart.cartItems[i].activeAddons[x].quantity)
        }
      }
      if (cart.cartItems[i].product && cart.cartItems[i].product.addon_items) {
        const requiredAddons = cart.cartItems[i].product.addon_items.filter(addon => addon.addon_required)
        if (requiredAddons.length > 0) {
          for (let x = 0, y = requiredAddons.length; x < y; x++) {
            if (
              !cart.cartItems[i].activeAddons ||
              (cart.cartItems[i].activeAddons &&
                cart.cartItems[i].activeAddons.filter(addon => addon.sku === requiredAddons[x].sku).length < 1)
            ) {
              count2 += cart.cartItems[i].quantity * requiredAddons[x].quantity
            }
          }
        }
      }
    }
  }
  return { cart: count, total: count + count2 }
}

export const getCartItemQuantity = sku => {
  const cart = getCart()
  if (cart && cart.cartItems && cart.cartItems.length > 0) {
    for (let i = 0, n = cart.cartItems.length; i < n; i++) {
      if (sku === cart.cartItems[i].sku) {
        return cart.cartItems[i].quantity
      }
    }
  }
  return 0
}

export function addToCart(product, price, activeAddons) {
  clearCheckoutState()
  let cart = getCart()
  let cartItems = cart && cart.cartItems ? cart.cartItems : []
  let alreadyInCart = false
  let existingProduct
  for (let i = 0; i < cartItems.length; i++) {
    if (
      cartItems[i].sku === product.sku &&
      (JSON.stringify(activeAddons) === JSON.stringify(cartItems[i].activeAddons) ||
        (!activeAddons && !cartItems[i].activeAddons))
    ) {
      alreadyInCart = true
      existingProduct = cartItems[i]
    }
  }
  if (!alreadyInCart) {
    store.dispatch(
      addProductToCart({
        sku: product.sku,
        quantity: 1,
        product: cartProduct(product),
        price: price,
        activeAddons: activeAddons,
      })
    )
  } else {
    store.dispatch(updateCartProductQuantity(existingProduct.sku, parseInt(existingProduct.quantity) + 1))
  }
}

export function removeFromCart(product, index) {
  clearCheckoutState()
  let cart = getCart()
  if (cart && cart.cartItems) {
    let cartItems = cart.cartItems
    for (let i = 0; i < cartItems.length; i++) {
      if (product.sku === cartItems[i].sku && index === i) {
        const quantity = cartItems[i].quantity
        fetchProductOrGC(product.sku).then(data => {
          window.dataLayer.push({
            event: 'ee_remove',
            ecommerce: { remove: { products: [analyticsProduct(data, quantity)] } },
          })
        })
        store.dispatch(removeProductFromCart(product.sku))
      }
    }
    let cartTotal = getCartTotal(cart)
    announce('Item removed. New cart total: $' + cartTotal)
  }
  if (cart && cart.cartItems.length == 0) {
    try {
      taskDone(
        () => {
          const ele = document.getElementById('empty-cart-continue')
          if (ele) {
            ele.focus()
          }
        },
        500,
        'focusEmpty'
      )
    } catch (e) {}
  }
}

export function getCartTotal(cart) {
  let subtotal = 0
  if (cart && cart.cartItems) {
    if (cart && cart.cartItems) {
      let cartItems = cart.cartItems
      for (let i = 0; i < cartItems.length; i++) {
        subtotal = subtotal + cartItems[i].quantity * cartItems[i].price
        if (cartItems[i].activeAddons) {
          for (let x = 0, n = cartItems[i].activeAddons.length; x < n; x++) {
            subtotal =
              subtotal +
              productPrice(cartItems[i].activeAddons[x]) * cartItems[i].activeAddons[x].quantity * cartItems[i].quantity
          }
        }
      }
    }
  }
  return subtotal
}

export const verifyAndUpdateCart = async cartIn => {
  const cart = { ...cartIn }
  if (cart && cart.cartItems && cart.cartItems.length > 0) {
    const cartItems = cart.cartItems
    const region = getRegionZone().region
    const price_zone = getRegionZone().zone
    const priceString = region + '_' + price_zone
    for (let i = 0, n = cartItems.length; i < n; i++) {
      if (cartItems[i]) {
        const product = await fetchProductOrGC(cartItems[i].sku)
        cartItems[i].product = cartProduct(product)
        const regionSalePrice = product.pricing[priceString + '_sale_price']
        const regionListPrice = product.pricing[priceString + '_list_price']
        if (regionSalePrice) {
          cartItems[i].price = regionSalePrice
        } else if (regionListPrice) {
          cartItems[i].price = regionListPrice
        } else {
          cartItems[i].price = product.pricing.default_price
        }
        if (i === n - 1) {
          cart.cartItems = cartItems
        }
      }
    }
  }
  saveLocalStorage('cart', cart)
}

export const checkProductRegionAvailability = async regionIn => {
  const rtg_location = getCurrentLocation()
  const region = regionIn ? regionIn : rtg_location ? rtg_location.region : 'FL'
  let cart = getCart()
  if (!cart || (cart && !cart.cartItems) || (cart && cart.cartItems && cart.cartItems.length < 1)) {
    cart = getFromBrowserStorage('local', 'cart')
  }
  if (cart && cart.cartItems && region) {
    let productPromises = []
    for (let i = 0; i < cart.cartItems.length; i++) {
      productPromises.push(
        fetchProductOrGC(cart.cartItems[i].sku).then(data => {
          let newData = data
          const product = cart.cartItems[i] && cart.cartItems[i].product
          if (
            rtg_location &&
            product &&
            (rtg_location.region !== 'OOM' ||
              ((product.delivery_type === 'O' || product.delivery_type === 'U') && rtg_location.region === 'OOM')) &&
            product.category !== 'gift-card'
          ) {
            return fetchProductWarehouseAvailability(data.sku, rtg_location.distribution_index, rtg_location.state)
              .then(data => {
                const stockMessage = availabilityStockMessage(data, product, rtg_location)
                if (
                  stockMessage === 'Discontinued' ||
                  stockMessage === 'Available Soon' ||
                  stockMessage === 'Out of Stock'
                ) {
                  newData.stock = false
                } else {
                  newData.stock = true
                }
                return newData
              })
              .catch(() => {
                newData.stock = false
                return newData
              })
          } else {
            newData.stock = true
            return newData
          }
        })
      )
    }
    return Promise.all(productPromises).then(products => {
      let skusNotAvailable = []
      for (let i = 0, n = products.length; i < n; i++) {
        if (products[i].category !== 'gift-card') {
          if (!products[i].stock) {
            skusNotAvailable.push({
              sku: products[i].sku,
              reason: 'stock',
            })
          } else if (
            !products[i].catalog_availability[region] &&
            products[i].delivery_type !== 'O' &&
            products[i].delivery_type !== 'U'
          ) {
            skusNotAvailable.push({
              sku: products[i].sku,
              reason: 'region',
            })
          }
        }
      }
      return skusNotAvailable
    })
  } else {
    return []
  }
}

export const getProductsFromCart = cart => {
  const cartObj = cart || getCart()
  let products = []
  let productPromises = []
  if (cartObj && cartObj.cartItems) {
    if (cartObj.cartItems.length > 0) {
      for (let i = 0; i < cartObj.cartItems.length; i++) {
        productPromises.push(fetchProductOrGC(cartObj.cartItems[i].sku))
      }
    } else {
      for (let item in cartObj.cartItems) {
        cartObj.cartItems[item]['product']['quantity'] = cartObj.cartItems[item]['quantity']
        products.push(cartObj.cartItems[item]['product'])
      }
    }
  }
  return Promise.all(productPromises)
}

export const getRoomsToGoDeliveryItems = cartItems => {
  let deliveryItems = []
  for (let i = 0, n = cartItems.length; i < n; i++) {
    let deliveryTypeBlacklist = ['O', 'U', 'T']
    if (!deliveryTypeBlacklist.includes(cartItems[i].product.delivery_type)) {
      deliveryItems.push(cartItems[i])
    }
  }
  return deliveryItems
}

export const getOtherDeliveryItems = cartItems => {
  let deliveryItems = []
  for (let i = 0, n = cartItems.length; i < n; i++) {
    let deliveryTypeWhitelist = ['O', 'U', 'T']
    if (deliveryTypeWhitelist.includes(cartItems[i].product.delivery_type)) {
      deliveryItems.push(cartItems[i])
    }
  }
  return deliveryItems
}

export const cartProduct = (product, quantity) => {
  if (product) {
    let newProduct = product
    const loc = getCurrentLocation()
    if (product.addon_items && product.addon_items.length > 0) {
      for (let i = 0, n = product.addon_items.length; i < n; i++) {
        delete newProduct.addon_items[i]['catalog_availability']
        for (let key in product.addon_items[i].pricing) {
          if (!key.includes(`${ loc.region }_${ loc.price_zone }`) && !key.includes('default')) {
            delete newProduct.addon_items[i].pricing[key]
          }
        }
      }
    }
    if (product.items_in_room) {
      if (product.items_in_room.FL || product.items_in_room.SE || product.items_in_room.TX) {
        for (let key in product.items_in_room) {
          if (key.includes(loc.region)) {
            newProduct.items_in_room = newProduct.items_in_room[key]
          }
        }
      }
    }
    return {
      title: newProduct.title,
      sku: newProduct.sku,
      price: productPrice(newProduct),
      list_price: productPrice(newProduct, true),
      unitPrice: newProduct.unitPrice,
      delivery_type: newProduct.delivery_type,
      category: newProduct.category,
      quantity: newProduct.quantity || quantity,
      free_shipping: newProduct.free_shipping,
      on_sale: productOnSale(newProduct),
      primary_image: newProduct.primary_image,
      addon_items: newProduct.addon_items,
      package_skus: newProduct.package_skus,
      items_in_room: newProduct.items_in_room,
      shipping_cost_code: newProduct.shipping_cost_code,
      strikethrough: newProduct.strikethrough,
    }
  } else {
    return null
  }
}

export const compareLineItems = (cartLineItems, orderLineItems) => {
  for (let i = 0, n = cartLineItems.length; i < n; i++) {
    const orderItems = orderLineItems.filter(orderItem => orderItem.sku === cartLineItems[i].sku)
    let quantity = 0
    for (let x = 0, y = orderItems.length; x < y; x++) {
      quantity += orderItems[x].quantity
    }
    if (quantity !== cartLineItems[i].quantity) {
      return false
    }
  }
  return true
}

export const setNewQuantity = (event, cart, sku, activeAddons) => {
  if (cart && cart.cartItems) {
    let cartItems = cart.cartItems
    for (let i = 0; i < cartItems.length; i++) {
      const quantity = parseInt(event.target.value)
      const productQuantity = cartItems[i].quantity
      if (cartItems[i].sku === sku && JSON.stringify(activeAddons) === JSON.stringify(cartItems[i].activeAddons)) {
        fetchProductOrGC(sku).then(data => {
          if (productQuantity < quantity) {
            window.dataLayer.push({
              event: 'ee_add',
              ecommerce: { add: { products: [analyticsProduct(data, quantity - productQuantity)] } },
            })
          } else if (productQuantity > quantity) {
            window.dataLayer.push({
              event: 'ee_remove',
              ecommerce: { remove: { products: [analyticsProduct(data, productQuantity - quantity)] } },
            })
          }
        })
        store.dispatch(updateCartProductQuantity(cartItems[i].sku, event.target.value))
        addToDataLayer('click', 'cart', 'change quantity', `${ sku }, ${ event.target.value }`)
      }
    }
    announce('Quantity Updated. New cart total: $' + getCartTotal(cart))
  }
}

export const cartUpdate = async (
  cart,
  skusNotAvailableIn,
  apiCalled,
  discount,
  setCartState,
  setApiCalled,
  updateOrder = false
) => {
  const region = getRegionZone().region
  if (cart && cart.cartItems && region) {
    checkProductRegionAvailability().then(skusNotAvailable => {
      if (skusNotAvailableIn.length === 0 || skusNotAvailable.length === 0) {
        setCartState({
          skusNotAvailable: skusNotAvailable,
        })
      }
    })
    let order = getOrder()
    const location = getCurrentLocation()
    const lineItems = getLineItems()
    let verifyQuantities
    if (order && order.lineItems) {
      verifyQuantities = compareLineItems(lineItems, order.lineItems)
    }
    const orderStorage = getFromBrowserStorage('session', 'order')
    if (!orderStorage) {
      order && store.dispatch(setOrder(order))
    }
    if (
      location &&
      lineItems &&
      lineItems.length > 0 &&
      (!order.orderId || updateOrder || verifyQuantities === false)
    ) {
      if (!apiCalled) {
        setApiCalled(true)
        if (!order.orderId) {
          order = await createOrder({
            lineItems: lineItems,
            region: location.region,
            zone: parseInt(location.price_zone),
            distribution_index: parseInt(location.distribution_index),
          })
          store.dispatch(setCheckoutStep('shipping'))
        } else {
          order = await updateLineItems({
            orderId: order.orderId,
            lineItems: lineItems,
            region: location.region,
            zone: parseInt(location.price_zone),
            distribution_index: parseInt(location.distribution_index),
          })
          order.total = order.total - order.tax - order.totalDeliveryCharge
          order.totalDeliveryCharge = 0
          order.tax = 0
          store.dispatch(setCheckoutStep('shipping'))
        }
        setApiCalled(false)
      }
      order && store.dispatch(setOrder(order))
    }
    setDiscount(order, discount, setCartState)
  }
}

export const setDiscount = (order, discountIn, setCartState) => {
  let discount = 0
  if (order && order.promotions && order.promotions.totalSavings && order.promotions.totalSavings > 0) {
    discount = parseFloat(order.promotions.totalSavings)
  }
  if (discount !== discountIn) {
    setCartState({
      showPayPal: true,
      discount: discount,
    })
  } else {
    setCartState({
      showPayPal: true,
    })
  }
}

export const removeUnavailableItems = (setCartState, skusNotAvailableIn) => {
  let cart = getCart()
  if (cart && cart.cartItems) {
    for (let i = cart.cartItems.length - 1; i >= 0; i--) {
      let skusNotAvailable = []
      skusNotAvailableIn.map(avail => skusNotAvailable.push(avail.sku))
      if (skusNotAvailable.includes(cart.cartItems[i].sku)) {
        cart.cartItems.splice(i, 1)
      }
    }
    if (cart.cartItems && cart.cartItems.length === 0) {
      cart = { cartItems: [] }
    }
    for (let key in sessionStorage) {
      if (key !== 'shippingInfo' && key !== 'cart') sessionStorage.removeItem(key)
    }
    store.dispatch(setCart(cart))
    setCartState({
      skusNotAvailable: [],
    })
  }
}

export const loadCartFromOrder = async orderId => {
  fetchOrder({ orderId: orderId }).then(order => {
    let cartItems = []
    if (order && order.lineItems && order.lineItems.length > 0) {
      order.lineItems.map(item => {
        cartItems.push(
          fetchProductOrGC(item.sku).then(product => {
            return {
              sku: product.sku,
              quantity: item.quantity,
              product: cartProduct(product),
              price: productPrice(product),
              activeAddons: null,
            }
          })
        )
      })
      Promise.all(cartItems).then(cartItems => {
        store.dispatch(setCart({ cartItems: cartItems }))
      })
    }
  })
}

export const getPromoTargetSkus = () => {
  const order = getOrder()
  if (order && order.promotions && order.promotions.availableTargetSkus) {
    return order.promotions.availableTargetSkus
  }
}
