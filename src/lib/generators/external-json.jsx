const fs = require('fs')
const axios = require('axios')

exports.storeFile = async ({ reporter }, url, fileName) => {
  const response = await axios.get(url)
  const stringifiedResponse = JSON.stringify(response.data, null, 2)
  const dataDir = `${ __dirname }/data`
  const filePath = `${ dataDir }/${ fileName }.json`
  try {
    fs.existsSync(dataDir) || fs.mkdirSync(dataDir)
    fs.writeFileSync(filePath, stringifiedResponse)
    reporter.success(`file created - ${ filePath }`)
  } catch (err) {
    reporter.panic(`Unable to save the file - ${ filePath }.`, err)
  }
}
