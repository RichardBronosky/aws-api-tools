const s3Bucket = require('./s3-product-data')

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, configOptions) => {
  if (process.env.GATSBY_BUILD_PRODUCT === 'true') {
    delete configOptions.plugins
    const { createNode } = actions
    const bucketName = configOptions.bucketName
    let productCount = 0
    let currentProductCount = 0
    const productLimit = process.env.GATSBY_ALL_S3_PRODUCT_DATA === 'true' ? 0 : 10
    const productKeys = await s3Bucket.listObjects(bucketName)
    const productKeyCount = productKeys.length
    const inDevelopment = process.env.NODE_ENV === 'development'
    console.log(`\n\n - ${ inDevelopment ? `Limiting to ${ productLimit } of ${ productKeyCount }` : `Processing ${ productKeyCount }` } Products -`)

    await Promise.all(
      productKeys.map(async s3Product => {
        const fileName = s3Product.Key
        if (currentProductCount < productLimit || !inDevelopment) {
          currentProductCount++
          await s3Bucket.getProductData(fileName, bucketName)
            .then(productData => {
              if (productData.sku) {
                productCount++
                const nodeContent = JSON.stringify(productData)
                const nodeData = Object.assign({}, s3Product, {
                  id: productData.sku,
                  sku: productData.sku,
                  title: productData.title,
                  parent: null,
                  children: [],
                  internal: {
                    type: `S3Product`,
                    content: nodeContent,
                    contentDigest: createContentDigest(productData),
                  },
                })
                createNode(nodeData)
              } else {
                console.log(`Unable to process s3 file (File Name: ${ fileName })`)
              }
            })
        }
      })
    )
    console.log(`\n\x1b[32mprocessed\x1b[0m ${ productCount } products\n`)
    return productKeys
  } else {
    return null
  }
}
