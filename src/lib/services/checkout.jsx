const axios = require('axios')

// TODO: Change to furniture.com API? Right now browser will show auth-token.
export const fetchAddressLookup = address =>
  axios
    .get(`https://api.edq.com/capture/address/v2/search?country=usa&take=10&shoppingState=&query=${ address }`, {
      headers: {
        'auth-token': '26dd9bb3-9ee2-41a7-a777-c3ec24cd411b',
      },
    })
    .then(response => response.data)

export const fetchPromotions = body =>
  axios.post(`${ process.env.GATSBY_PROMOTIONS_SERVICE_URL }/get_pricing/`, body).then(response => response.data)

/* Order Service */
export const getOrder = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/getOrder/`, body).then(response => response.data)

export const getToken = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/getToken/`, body).then(response => response.data)

export const createOrder = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/createOrder/`, body).then(response => response.data)

export const updateLineItems = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/updateLineItems/`, body).then(response => response.data)

export const updateAddress = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/updateAddress/`, body).then(response => response.data)

export const updateDelivery = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/updateDelivery/`, body).then(response => response.data)

export const updatePayment = body =>
  axios.post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/updatePayment/`, body).then(response => response.data)

export const placeOrder = (orderId, session, TL_RTG) =>
  axios
    .post(`${ process.env.GATSBY_ORDER_SERVICE_URL }/placeOrder/`, { orderId: orderId, session: session, TL_RTG: TL_RTG })
    .then(response => response.data)
