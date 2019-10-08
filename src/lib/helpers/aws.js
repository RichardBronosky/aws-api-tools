const AWS = require('aws-sdk')
const { loopWhile } = require('deasync')
const client = new AWS.SecretsManager({ region: 'us-east-1' })
const { GET_SECRETS } = process.env

const getSecretNames = async () => {
  const resp = await client.listSecrets({ MaxResults: 100 }).promise()
  const secrets = resp.SecretList.map(s => s.Name)
  return secrets
}

const tryParse = stringValue => {
  try {
    return JSON.parse(stringValue)
  } catch (err) {
    return {}
  }
}

const getSecret = async name => {
  const resp = await client.getSecretValue({ SecretId: name }).promise()
  return tryParse(resp.SecretString)
}

exports.getSecrets = () => {
  let secrets = {}
  let done = false
  if (GET_SECRETS) {
    getSecretNames()
      .then(names => Promise.all(names.map(n => getSecret(n))))
      .then(secretObjects => {
        secretObjects.forEach(s => Object.assign(secrets, s))
        done = true
      })
      .catch(err => {
        done = true
        console.log('\nERROR (/helpers/aws.js): ' + err)
      })
    loopWhile(() => !done)
  }
  return secrets
}
