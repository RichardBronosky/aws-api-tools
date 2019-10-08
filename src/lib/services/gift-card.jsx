const axios = require('axios')

export const balanceInquiry = body =>
  axios.post(`${ process.env.GATSBY_GC_SERVICE_URL }/balanceInquiry/`, body).then(response => response.data)
