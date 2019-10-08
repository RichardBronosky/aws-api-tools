const fs = require('fs')
const index = require('./src/sitemap/index')
const pages = require('./src/sitemap/pages')
const stores = require('./src/sitemap/stores')
const products = require('./src/sitemap/products')

exports.onPostBuild = async ({ cache, store, graphql }, pluginOptions) => {
  console.log(`\nPost Build: Initialized Sitemap Plugin`)
  const options = { ...pluginOptions }
  delete options.plugins
  delete options.createLinkInHead
  const { siteUrl } = { ...options }
  !fs.existsSync(`./public/sitemap/`) && fs.mkdirSync(`./public/sitemap/`)
  !fs.existsSync(`./public/sitemap/product`) && fs.mkdirSync(`./public/sitemap/product`)

  await index.createIndex({ cache, store }, { siteUrl })
  await index.createUrlSet({ cache, store }, { siteUrl })
  await pages.createUrlSet({ cache, store, graphql }, { siteUrl })
  await stores.createUrlSet({ cache, store, graphql }, { siteUrl })
  await products.createIndex({ cache, store }, { siteUrl })
}
