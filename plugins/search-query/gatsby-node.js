const search = require('./search.js')

exports.onCreateNode = async ({ node, getNode, actions }) => {
  if (node.internal.type === 'ContentfulSearchQuery') {
    await search.addSearchNodeFieldsToGraph({ node, getNode, actions })
  }
}
