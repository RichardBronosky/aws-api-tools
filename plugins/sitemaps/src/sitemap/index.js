const { sitemapIndex, sitemapUrlSet } = require('../helpers')

exports.createIndex = async ({ cache, store }, { siteUrl }) => {
  const cacheKey = 'indexUrlIndex'
  let obj = await cache.get(cacheKey)
  if (!obj) {
    let obj = {}
    obj.data = [
      '/sitemap/global.xml',
      '/sitemap/product.xml',
      '/sitemap/pages.xml',
      '/sitemap/stores.xml',
    ]
    return await sitemapIndex(siteUrl, obj.data, 'sitemap')
  } else {
    return await sitemapIndex(siteUrl, obj.data, 'sitemap')
  }
}

exports.createUrlSet = async ({ cache, store }, { siteUrl }) => {
  const cacheKey = 'indexUrlSet'
  let obj = await cache.get(cacheKey)
  if (!obj) {
    let obj = {}
    obj.data = [
      '/',
      '/search',
      '/credit/options',
      '/customer-service/delivery-shipping',
    ]
    return await sitemapUrlSet(siteUrl, obj.data, 'sitemap/global')
  } else {
    return await sitemapUrlSet(siteUrl, obj.data, 'sitemap/global')
  }
}
