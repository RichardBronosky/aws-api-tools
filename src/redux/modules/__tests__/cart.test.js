import reducer, {
  SET_CART,
  ADD_PRODUCT_TO_CART,
  UPDATE_CART_PRODUCT_QUANTITY,
  REMOVE_PRODUCT_FROM_CART,
  CLEAR_CART,
} from '../cart'
import { mockProduct1, mockProduct2 } from '../../../lib/mocks/productDataMocks'
import { mockCartItem1, mockCartItem2, mockCart } from '../../../lib/mocks/cartDataMocks'

const initialState = {
  cart: {
    cartItems: [],
  },
}

describe('cart reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SET_CART', () => {
    expect(
      reducer(initialState, {
        type: SET_CART,
        cart: mockCart,
      })
    ).toEqual({
      cart: mockCart,
    })
  })

  it('should handle ADD_PRODUCT_TO_CART when product is not already in cart', () => {
    expect(
      reducer(initialState, {
        type: ADD_PRODUCT_TO_CART,
        product: mockProduct1,
      })
    ).toEqual({
      cart: {
        cartItems: [mockProduct1],
      },
    })
  })

  it("should handle UPDATE_CART_PRODUCT_QUANTITY when increasing mockCartItem1's quantity from 1 to 5", () => {
    expect(
      reducer(
        {
          cart: mockCart,
        },
        {
          type: UPDATE_CART_PRODUCT_QUANTITY,
          sku: mockProduct1.sku,
          quantity: 5,
        }
      )
    ).toEqual({
      cart: {
        cartItems: [{ ...mockCartItem1, quantity: 5 }, mockCartItem2],
      },
    })
  })

  it("should handle UPDATE_CART_PRODUCT_QUANTITY when decreasing mockCartItem2's quantity from 3 to 1", () => {
    expect(
      reducer(
        {
          cart: mockCart,
        },
        {
          type: UPDATE_CART_PRODUCT_QUANTITY,
          sku: mockProduct2.sku,
          quantity: 1,
        }
      )
    ).toEqual({
      cart: {
        cartItems: [mockCartItem1, { ...mockCartItem2, quantity: 1 }],
      },
    })
  })

  it('should handle REMOVE_PRODUCT_FROM_CART when removing mockCartItem2', () => {
    expect(
      reducer(
        {
          cart: mockCart,
        },
        {
          type: REMOVE_PRODUCT_FROM_CART,
          sku: mockProduct2.sku,
        }
      )
    ).toEqual({
      cart: {
        cartItems: [mockCartItem1],
      },
    })
  })

  it('should handle CLEAR_CART and clear the cart', () => {
    expect(
      reducer(initialState, {
        type: CLEAR_CART,
        cart: mockCart,
      })
    ).toEqual({
      cart: {
        cartItems: [],
      },
    })
  })
})
