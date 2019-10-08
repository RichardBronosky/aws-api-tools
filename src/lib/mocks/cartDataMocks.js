export const mockCartItem1 = {
  activeAddons: null,
  price: 279.99,
  product: {
    title: 'Adaire Brown Side Table',
    sku: '23122360',
    price: 279.99,
    list_price: 349.99,
    delivery_type: 'O',
    category: 'tables',
    free_shipping: true,
    on_sale: true,
    primary_image:
      'http://images.rtg-dev.com/adaire-brown-side-table_23122360_image-item?cache-id=81c2298dd5804701ca610022d0a4d090',
    shipping_cost_code: { FL: 'VD71', SE: 'VD71', TX: 'VD71' },
    strikethrough: { FL: true, OM: true, SE: true, TX: true },
  },
  sku: '23122360',
  quantity: 1,
}

export const mockCartItem2 = {
  sku: '1141677P',
  product: {
    title: 'Laney Park Dark Gray 7 Pc Sectional',
    sku: '1141677P',
    price: 1199.99,
    list_price: 1299.99,
    delivery_type: 'D',
    category: 'livingroom',
    free_shipping: false,
    on_sale: true,
    primary_image:
      'http://images.rtg-dev.com/laney-park-dark-gray-7-pc-sectional_1141677P_image-room?cache-id=a7e194ec3ebbb82c6482c801d3971efc',
    package_skus: {
      SE: [
        { sku: '12216760', quantity: 1, price: '208.43' },
        { sku: '12116768', quantity: 4, price: '172.94' },
        { sku: '12316762', quantity: 1, price: '231.63' },
        { sku: '12516766', quantity: 1, price: '68.17' },
      ],
      TX: [
        { sku: '12316762', quantity: '1', price: '231.63' },
        { sku: '12216760', quantity: '1', price: '208.43' },
        { sku: '12516766', quantity: '1', price: '68.17' },
        { sku: '12116768', quantity: '4', price: '172.94' },
      ],
      FL: [
        { sku: '12316762', quantity: '1', price: '248.65' },
        { sku: '12116768', quantity: '4', price: '185.62' },
        { sku: '12216760', quantity: '1', price: '223.71' },
        { sku: '12516766', quantity: '1', price: '73.16' },
      ],
    },
    shipping_cost_code: { FL: 'ROOM', SE: 'ROOM', TX: 'ROOM' },
  },
  price: 1199.99,
  activeAddons: null,
  quantity: 3,
}

export const mockCart = {
  cartItems: [mockCartItem1, mockCartItem2],
}
