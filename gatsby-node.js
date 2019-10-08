const contentfulPage = require('./src/lib/generators/contentful-page.jsx')
const product = require('./src/lib/generators/product.jsx')
const stores = require('./src/lib/generators/stores.jsx')
const externalJson = require('./src/lib/generators/external-json.jsx')
const financeFeed = require('./src/lib/generators/finance-feed.jsx')

exports.onPreInit = async ({ reporter }) => {
  externalJson.storeFile({ reporter }, `${ process.env.GATSBY_S3_MISC_URL }/store-hours-feed.json`, `store-hours-feed`) 
}

exports.createPages = async ({ graphql, actions }) => {
  await financeFeed.storeFile({ graphql }) 
  await contentfulPage.addPages({ graphql, actions })
  await product.addPages({ graphql, actions })
  await stores.addPages({ graphql, actions })
}

exports.onCreateWebpackConfig = ({
  stage,
  getConfig,
  actions: { replaceWebpackConfig }
}) => {
  switch (stage) {
    case 'build-javascript':
      const config = getConfig()

      const app =
        typeof config.entry.app === 'string'
          ? [config.entry.app]
          : config.entry.app

      config.entry.app = ['@babel/polyfill', ...app]
      replaceWebpackConfig(config)
  }
}
