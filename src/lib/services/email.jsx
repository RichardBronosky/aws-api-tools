const axios = require('axios')

export const emailSignup = body =>
  axios.post(`${ process.env.GATSBY_EMAIL_SERVICE_URL }/signup/`, body).then(response => response.data)
