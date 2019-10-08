// Gatsby requires any env variable that is set use 'GATSBY_' as a prefix in order to access it in src.
const path = require('path')
const aws = require('./src/lib/helpers/aws')
process.env.ACTIVE_ENV = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development'
process.env.GATSBY_ENV_SHORT = process.env.GATSBY_ENV_SHORT || ((process.env.ACTIVE_ENV === 'production') ? 'prod' : 'dev')

const awsSecrets = aws.getSecrets()
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
// Use ENVIRONMENT_VARS or SECRETS_MANAGER or 'DEFAULT_VALUE'
process.env.GATSBY_ALGOLIA_APP_ID = process.env.GATSBY_ALGOLIA_APP_ID || awsSecrets.ALGOLIA_APP_ID
process.env.GATSBY_ALGOLIA_API_KEY = process.env.GATSBY_ALGOLIA_API_KEY || awsSecrets.ALGOLIA_API_KEY
process.env.GATSBY_GOOGLE_BROWSER_API_KEY = process.env.GATSBY_GOOGLE_BROWSER_API_KEY || awsSecrets.GOOGLE_BROWSER_API_KEY
process.env.GATSBY_ALL_S3_PRODUCT_DATA = process.env.GATSBY_ALL_S3_PRODUCT_DATA || awsSecrets.ALL_S3_PRODUCT_DATA
process.env.GATSBY_AWS_PRODUCT_URL = process.env.GATSBY_AWS_PRODUCT_URL || awsSecrets.AWS_PRODUCT_URL
process.env.GATSBY_ORDER_SERVICE_URL = process.env.GATSBY_ORDER_SERVICE_URL || awsSecrets.ORDER_SERVICE_URL
process.env.GATSBY_ORDER_MANAGEMENT_URL = process.env.GATSBY_ORDER_MANAGEMENT_URL || awsSecrets.ORDER_MANAGEMENT_URL
process.env.GATSBY_LOCATION_SERVICE_URL = process.env.GATSBY_LOCATION_SERVICE_URL || awsSecrets.LOCATION_SERVICE_URL
process.env.GATSBY_EMAIL_SERVICE_URL = process.env.GATSBY_EMAIL_SERVICE_URL || awsSecrets.EMAIL_SERVICE_URL
process.env.GATSBY_VISA_CHECKOUT_API_KEY = process.env.GATSBY_VISA_CHECKOUT_API_KEY || awsSecrets.VISA_CHECKOUT_API_KEY
process.env.GATSBY_AFFIRM_API_KEY = process.env.GATSBY_AFFIRM_API_KEY || awsSecrets.AFFIRM_API_KEY
process.env.GATSBY_PAYPAL_API_KEY = process.env.GATSBY_PAYPAL_API_KEY || awsSecrets.PAYPAL_API_KEY
process.env.GATSBY_S3_PRODUCT_BUCKET = process.env.GATSBY_S3_PRODUCT_BUCKET || awsSecrets.S3_PRODUCT_BUCKET
process.env.GATSBY_SEEINSTORE_SERVICE_URL = process.env.GATSBY_SEEINSTORE_SERVICE_URL || awsSecrets.SEEINSTORE_SERVICE_URL
process.env.GATSBY_AVAILABILITY_SERVICE_URL = process.env.GATSBY_AVAILABILITY_SERVICE_URL || awsSecrets.AVAILABILITY_SERVICE_URL
process.env.GATSBY_S3_IMAGE_URL = process.env.GATSBY_S3_IMAGE_URL || awsSecrets.S3_IMAGE_URL
process.env.GATSBY_SENTRY_DNS_URL = process.env.GATSBY_SENTRY_DNS_URL || awsSecrets.SENTRY_DNS_URL
process.env.GATSBY_CONTENTFUL_SPACE_ID = process.env.GATSBY_CONTENTFUL_SPACE_ID || awsSecrets.CONTENTFUL_SPACE_ID
process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN = process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN || awsSecrets.CONTENTFUL_ACCESS_TOKEN
process.env.GATSBY_CONTENTFUL_ENVIRONMENT = process.env.GATSBY_CONTENTFUL_ENVIRONMENT || 'master'
process.env.GATSBY_RTG_REGION = process.env.GATSBY_RTG_REGION || awsSecrets.GATSBY_RTG_REGION
process.env.GATSBY_BUILD_PRODUCT = process.env.GATSBY_BUILD_PRODUCT || awsSecrets.GATSBY_BUILD_PRODUCT || false
process.env.GATSBY_S3_MISC_URL = process.env.GATSBY_S3_MISC_URL || awsSecrets.S3_MISC_URL
process.env.GATSBY_RELEASE_VERSION = process.env.GATSBY_RELEASE_VERSION || 'development'
process.env.GATSBY_PROMOTIONS_SERVICE_URL = process.env.GATSBY_PROMOTIONS_SERVICE_URL || awsSecrets.PROMOTIONS_SERVICE_URL
process.env.GATSBY_GC_SERVICE_URL = process.env.GATSBY_GC_SERVICE_URL || awsSecrets.GC_SERVICE_URL

process.env.GATSBY_CYBERSOURCE_ACCEPTANCE_URL = process.env.CYBERSOURCE_ACCEPTANCE_URL || awsSecrets.CYBERSOURCE_ACCEPTANCE_URL || 'https://testsecureacceptance.cybersource.com'
process.env.GATSBY_VISA_CHECKOUT_URL = process.env.VISA_CHECKOUT_URL || awsSecrets.VISA_CHECKOUT_URL || 'https://sandbox.secure.checkout.visa.com'
process.env.GATSBY_VISA_ASSETS_URL = process.env.VISA_ASSETS_URL || awsSecrets.VISA_ASSETS_URL || 'https://sandbox-assets.secure.checkout.visa.com'
process.env.GATSBY_AFFIRM_URL = process.env.AFFIRM_URL || awsSecrets.AFFIRM_URL || 'https://cdn1-sandbox.affirm.com'
process.env.GATSBY_PAYPAL_ENV = process.env.ACTIVE_ENV && process.env.ACTIVE_ENV === 'production' ? 'production' : 'sandbox'

process.env.GATSBY_ALGOLIA_REGION_INDEX = `${ process.env.GATSBY_RTG_REGION }-${ process.env.GATSBY_ENV_SHORT }`
process.env.GATSBY_CREDIT_POSTBACK_URL = process.env.GATSBY_CREDIT_POSTBACK_URL || awsSecrets.CREDIT_POSTBACK_URL
process.env.GATSBY_CREDIT_UNIQUE_ID = process.env.GATSBY_CREDIT_UNIQUE_ID || awsSecrets.CREDIT_UNIQUE_ID
process.env.GATSBY_CREDIT_PCGC = process.env.GATSBY_CREDIT_PCGC || awsSecrets.CREDIT_PCGC
process.env.GATSBY_CREDIT_MID = process.env.GATSBY_CREDIT_MID || awsSecrets.CREDIT_MID
process.env.GATSBY_SYNCHRONY_URL = process.env.GATSBY_SYNCHRONY_URL || awsSecrets.SYNCHRONY_URL
process.env.GATSBY_SYNCHRONY_ACCOUNT_URL = process.env.GATSBY_SYNCHRONY_ACCOUNT_URL || awsSecrets.SYNCHRONY_ACCOUNT_URL

const printVars = () => {
  const gatsbyVars = Object.keys(process.env).filter(k => k.includes('GATSBY'))

  console.log('\n')
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`ACTIVE_ENV: ${process.env.ACTIVE_ENV}`)
  gatsbyVars.forEach(envVar => console.log(`${envVar}: ${process.env[envVar]}`))
  console.log('\n')
}
printVars()

module.exports = {
  siteMetadata: {
    title: 'Rooms to Go',
    siteUrl: `https://www.roomstogo.com`
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-transformer-remark',
    `gatsby-transformer-json`,
    'gatsby-plugin-remove-trailing-slashes',
    'search-query',
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/search/*`, `/furniture/product/*`, `/order/success/*`, `/cart/*`] }
    },
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID,
        accessToken: process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN,
        environment: process.env.GATSBY_CONTENTFUL_ENVIRONMENT,
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: 'GTM-WH7CJC9',
        includeInDevelopment: true,
        dataLayerName: 'dataLayer'
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
        ignore: [`${__dirname}/src/lib/generators/data`]
      }
    },
    {
      resolve: 's3-product',
      options: {
        bucketName: process.env.GATSBY_S3_PRODUCT_BUCKET
      }
    },
    {
      resolve: `sitemaps`,
      options: {
        siteUrl: `https://www.roomstogo.com`
      }
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          '@components': 'src/components',
          '@shared': 'src/components/shared',
          '@helpers': 'src/lib/helpers',
          '@services': 'src/lib/services',
          '@mocks': 'src/lib/mocks',
          '@pages': 'src/pages',
          '@assets': 'src/assets',
          '@sass': 'src/assets/css',
          '@images': 'src/assets/images',
          '@comp-sass': 'src/assets/css/components',
          '@templates': 'src/templates',
          '@redux': 'src/redux',
        },
      }
    }
  ]
}
