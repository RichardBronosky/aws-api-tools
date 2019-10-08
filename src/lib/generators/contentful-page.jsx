const path = require(`path`)
const helper = require('../helpers/contentful')

exports.addPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const { data } = await graphql(`
    {
      allContentfulPage {
        edges {
          node {
            id
            startDate
            endDate
            route
            contentDefault: content {
              __typename
            }
            contentOom {
              __typename
            }
            contentSe {
              __typename
            }
            contentFl {
              __typename
            }
            contentTx {
              __typename
            }
          }
        }
      }
    }
  `)

  if (data) {
    for (page of data.allContentfulPage.edges) {
      if (helper.canPublishContent(page.node)) {
        const node = page.node
        if (node.route !== '/404') {
          let nodePath = node.route !== '/' ? node.route.replace(/^\/|\/$/g, '') : node.route
          const newPage = {
            path: `${ nodePath }`,
            component: path.resolve(`./src/templates/contentful-page.jsx`),
            context: {
              pageId: node.id,
            },
          }
          if (helper.hasSearchQuery(helper.selectRegionBasedContent(process.env.GATSBY_RTG_REGION, node))) {
            newPage.matchPath = `${ node.route }/*`
          }
          createPage(newPage)
        }
      }
    }
  }
}
