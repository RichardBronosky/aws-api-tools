import { saveLocalStorage } from '../../lib/helpers/storage'

// Actions
export const SET_CART = 'SET_CART'
export const ADD_PRODUCT_TO_CART = 'ADD_PRODUCT_TO_CART'
export const UPDATE_CART_PRODUCT_QUANTITY = 'UPDATE_CART_PRODUCT_QUANTITY'
export const REMOVE_PRODUCT_FROM_CART = 'REMOVE_PRODUCT_FROM_CART'
export const CLEAR_CART = 'CLEAR_CART'
export const ADD_ACTIVE_ADDON = 'ADD_ACTIVE_ADDON'
export const REMOVE_ACTIVE_ADDON = 'REMOVE_ACTIVE_ADDON'

// Action Creators
export const setCart = cart => {
  if (cart && cart.cartItems && cart.cartItems.length > 0) {
    saveLocalStorage('cart', cart)
  }
  return { type: SET_CART, cart }
}

export const addProductToCart = product => {
  return { type: ADD_PRODUCT_TO_CART, product }
}

export const updateCartProductQuantity = (sku, quantity) => {
  return { type: UPDATE_CART_PRODUCT_QUANTITY, sku, quantity }
}

export const removeProductFromCart = sku => {
  return { type: REMOVE_PRODUCT_FROM_CART, sku }
}

export const clearCart = () => {
  return { type: CLEAR_CART }
}

export const addActiveAddon = (productSku, addon, cartIndex) => {
  return { type: ADD_ACTIVE_ADDON, productSku, addon, cartIndex }
}

export const removeActiveAddon = (productSku, addonSku, cartIndex) => {
  return { type: REMOVE_ACTIVE_ADDON, productSku, addonSku, cartIndex }
}

// Reducer
const initialState = {
  cart: {
    cartItems: [],
  },
}

export default (state = initialState, action) => {
  const newState = { ...state }
  switch (action.type) {
    case SET_CART:
      return {
        ...newState,
        cart: action.cart,
      }
    case ADD_PRODUCT_TO_CART:
      newState.cart.cartItems.push(action.product)
      saveLocalStorage('cart', newState.cart)
      return {
        ...state,
        cart: { ...newState.cart },
      }
    case UPDATE_CART_PRODUCT_QUANTITY:
      newState.cart.cartItems.map(
        obj =>
          (newState.cart.cartItems.find(product => {
            return product.sku === action.sku
          }).quantity = parseInt(action.quantity) || obj)
      )
      saveLocalStorage('cart', newState.cart)
      return {
        ...state,
        cart: { ...newState.cart },
      }
    case REMOVE_PRODUCT_FROM_CART:
      const index = newState.cart.cartItems.findIndex(product => {
        return product.sku === action.sku
      })
      newState.cart.cartItems.splice(index, 1)
      saveLocalStorage('cart', newState.cart)
      return {
        ...state,
        cart: { ...newState.cart },
      }
    case CLEAR_CART:
      saveLocalStorage('cart', { cartItems: [] })
      return {
        ...state,
        cart: { cartItems: [] },
      }
    case ADD_ACTIVE_ADDON: {
      const product = newState.cart.cartItems[action.cartIndex]
      product.activeAddons = product.activeAddons ? product.activeAddons : []
      product.activeAddons.push(action.addon)
      newState.cart.cartItems[action.cartIndex] = product
      saveLocalStorage('cart', newState.cart)
      return {
        ...state,
        cart: { ...newState.cart },
      }
    }
    case REMOVE_ACTIVE_ADDON: {
      const product = newState.cart.cartItems[action.cartIndex]
      const addonIndex = product.activeAddons.findIndex(addon => addon.sku === action.addonSku)
      product.activeAddons.splice(addonIndex, 1)
      product.activeAddons = product.activeAddons.length === 0 ? null : product.activeAddons
      newState.cart.cartItems[action.cartIndex] = product
      saveLocalStorage('cart', newState.cart)
      return {
        ...state,
        cart: { ...newState.cart },
      }
    }
    default:
      return state
  }
}
