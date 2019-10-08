const axios = require('axios')

export const fetchCreditPostback = () =>
  axios.get(`${ process.env.GATSBY_CREDIT_POSTBACK_URL }`).then(response => response.data)
