const algoliasearch = require('algoliasearch')
const algoliasearchHelper = require('algoliasearch-helper')

exports.addSearchNodeFieldsToGraph = async ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  const client = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_API_KEY)
  const searchIndex = process.env.GATSBY_ALGOLIA_REGION_INDEX
  const query = getNode(node.resultList___NODE)
  const facets = query.facets ? query.facets : []
  let searchSettings = {
    query: `${ query.keywords || '' }`,
    facets: facets,
    hitsPerPage: query.hitsPerPage || 20,
    ruleContexts: [query.ruleContexts],
    filters: query.filters ? query.filters : '',
  }
  if (process.env.NODE_ENV === 'development' && node.contentful_id !== 'SQ5bd3d2bd513fa18f7e3f9ae2f5872beb') { 
    return createNodeField({
      node,
      name: 'response',
      value: JSON.stringify(devResponse()),
    })
  }
  await algoliasearchHelper(client, searchIndex, searchSettings).searchOnce().then(res => {
    return createNodeField({
      node,
      name: 'response',
      value: JSON.stringify(res),
    })
  }).catch(err => console.log(err))
}

function devResponse() {
  return {
    content: {
      query: '',
      hits: [],
      index: 'FL-dev',
      hitsPerPage: 20,
      nbHits: 1,
      nbPages: 1,
      page: 0,
      exhaustiveFacetsCount: true,
      exhaustiveNbHits: true,
    },
    state: {
      index: 'FL-dev',
      query: '',
      hitsPerPage: 20,
      page: 0,
      filters: ''
    },
    _originalResponse: { results: [ [{}] ] }
  }
}
