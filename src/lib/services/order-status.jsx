const axios = require('axios')

export const getOrderList = body =>
  axios.post(`${ process.env.GATSBY_ORDER_MANAGEMENT_URL }/getRelatedOrders`, body).then(response => response.data)

export const getOrderDetails = body =>
  axios.post(`${ process.env.GATSBY_ORDER_MANAGEMENT_URL }/getRtgOrder`, body).then(response => response.data)
