const axios = require('axios')

export const getLocation = zip =>
  axios.get(`${ process.env.GATSBY_LOCATION_SERVICE_URL }?zip=${ zip }`).then(response => response.data)
