const { sitemapUrlSet } = require('../helpers')

exports.createUrlSet = async ({ cache, store, graphql }, { siteUrl }) => {
  const cacheKey = 'storesUrlSet'
  let obj = await cache.get(cacheKey)
  if (!obj) {
    let obj = {}
    const query = `
      {
        allSitePage(filter: { path: { regex: "^/stores/" } }) {
          edges {
            node {
              path
            }
          }
        }
      }
    `
    await graphql(query).then(async r => {
      if (r.errors) { throw new Error(r.errors.join(`, `)) }
      let urls = r.data.allSitePage.edges.map(({ node }) => (node.path))
      obj.data = urls
      await cache.set(cacheKey, obj)
      return sitemapUrlSet(siteUrl, obj.data, 'sitemap/stores')
    })
  } else {
    return sitemapUrlSet(siteUrl, obj.data, 'sitemap/stores')
  }
}
