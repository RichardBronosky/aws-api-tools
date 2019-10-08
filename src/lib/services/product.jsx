const axios = require('axios')

export const fetchProductBySku = sku =>
  axios.get(`${ process.env.GATSBY_AWS_PRODUCT_URL }${ sku.toUpperCase() }.json`).then(response => response.data)

export const fetchProductWarehouseAvailability = (sku, distributionIndex, state) =>
  axios
    .get(
      `${ process.env.GATSBY_AVAILABILITY_SERVICE_URL }/availability?skus=${ sku }&distributionIndex=${ distributionIndex }&state=${ state }`
    )
    .then(response => response.data)

export const getSeeInStore = (sku, zip) =>
  axios
    .get(`${ process.env.GATSBY_SEEINSTORE_SERVICE_URL }/seeInStore?sku=${ sku }&zipcode=${ zip }`)
    .then(response => response.data)
