const _axios = require('axios')
const { slugify } = require('../../../../src/lib/helpers/string-helper')
const { sitemapIndex, sitemapUrlSet } = require('../helpers')
const baseURL = 'http://products.rtg-dev.com'

const axios = _axios.create({
  baseURL,
  timeout: 30000,
})

exports.createIndex = async ({ cache, store }, { siteUrl }) => {
  let indexUrls = []
  let productUrlset = []
  const perPage = 1000
  const pageCount = await productList(1, 1).then(res => { return Math.ceil(res.numberOfResults / perPage) })
  for(var i = 0; i < pageCount; i++) {
    const productPath = `/sitemap/product/${ i + 1 }`
    const cacheKey = `product-sitemap-${ i + 1 }`
    indexUrls.push(`${ productPath }.xml`)
    let obj = await cache.get(cacheKey)
    if (!obj) {
      obj = {}
      productUrlset.push(
        productList(perPage, i + 1).then(res => {
          const productUrls = []
          if (res && res.data) {
            for(var p = 0; p < res.data.length; p++) {
              let product = res.data[p]
              if (product && product.title && product.sku) {
                productUrls.push(`/furniture/product/${ slugify(res.data[p].title) }/${ res.data[p].sku }`)
              }
            }
          }
          obj.data = productUrls
          cache.set(cacheKey, obj)
          sitemapUrlSet(siteUrl, obj.data, productPath, '0.8')
        }).catch(err => console.log(err))
      )
    }
    await cache.set(cacheKey, obj)
  }
  await Promise.all(productUrlset).then(_=> {
    return sitemapIndex(siteUrl, indexUrls, `/sitemap/product`)
  })
}

async function productList(perPage, pageNumber) {
  return await axios.get(
    `/products/list?perPage=${ perPage }&page=${ pageNumber }`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "BOY60bRoeK8114vbwlF733OHtJcwGUum9Mas5DtD"
      }
    }
  ).then(response => { return response.data })
  .catch(err => console.log(err))
}
