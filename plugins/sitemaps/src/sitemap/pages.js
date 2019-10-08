const { sitemapUrlSet } = require('../helpers')

exports.createUrlSet = async ({ cache, store, graphql }, { siteUrl }) => {
  const cacheKey = 'pagesUrlSet'
  let obj = await cache.get(cacheKey)
  if (!obj) {
    let obj = {}
    const query = `
      {
        allContentfulPage(filter: { seo: { metaRobots: { nin: ["noindex, nofollow", "noindex, follow", "noindex"] } } }) {
          edges {
            node {
              route
            }
          }
        }
      }
    `
    await graphql(query).then(async r => {
      if (r.errors) { throw new Error(r.errors.join(`, `)) }
      let urls = r.data.allContentfulPage.edges.map(({ node }) => (node.route))
      obj.data = urls
      await cache.set(cacheKey, obj)
      return sitemapUrlSet(siteUrl, obj.data, 'sitemap/pages')
    })
  } else {
    return sitemapUrlSet(siteUrl, obj.data, 'sitemap/pages')
  }
}
