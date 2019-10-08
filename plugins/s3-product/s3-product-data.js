const AWS = require('aws-sdk')
const s3 = new AWS.S3()

exports.listObjects = (bucketName) => {
  let productKeys = []
  return new Promise(function(resolve, reject) {
    getProductKeys()
    function getProductKeys(lastKey) {
      let params = { Bucket: bucketName, MaxKeys: 1000 }
      if (lastKey) { params["StartAfter"] = lastKey }
      s3.listObjectsV2(params).promise().then(data => {
        for (let i=0; i < data.Contents.length; i++) {
          productKeys.push(data.Contents[i])
          if (data.IsTruncated && (i === data.Contents.length - 1)) {
            getProductKeys(data.Contents[i].Key)
          }
        }
        if (!data.IsTruncated) { resolve(productKeys) }
      }).catch(err => {
        console.warn(`\n\n*** You must assume role to pull product data. ***\n\nAWS ERROR: (${ err })\n`)
        reject(productKeys)
      })
    }
  })
}

exports.getProductData = (key, bucketName) => {
  return new Promise(function(resolve, reject) {
    s3.getObject({ Bucket: bucketName, Key: key }, function (err, data) {
      const productData = JSON.parse(data.Body.toString())
      delete productData.seeInRoom_2
      resolve(productData)
    })
  })
}
