const contentful = require('contentful-management')
let contentfulConfig = require('../../../.contentful.json')
contentfulConfig = contentfulConfig.production
let successCount = 0
let failCount = 0
const defaultExcludedEntries = []
let failedEntryIdList = []

// OPTIONS
const contentfulEnvironmentId = 'master'
const contentTypeId = 'page'
const contentSetStatus = 'delete'
const contentCountLimit = 8 // 8 is for the most part the max before getting rate limited.

updateContentful()

async function updateContentful() {
  successCount = 0
  failCount = 0

  if (contentSetStatus === 'draft') {
    contentfulEntries(false, true).then(entries => {
      draftPublishedEntries(entries)
    })
  }
  if (contentSetStatus === 'delete') {
    contentfulEntries(false, false).then(entries => {
      deleteDraftedEntries(entries)
    })
  }
  if (contentSetStatus === 'publish') {
    contentfulEntries(false, false).then(entries => {
      publishDraftedEntries(entries)
    })
  }
}

async function contentfulEntries(archived, published) {
  return new Promise(function(resolve, reject) {
    contentful
      .createClient({
        accessToken: 'CFPAT-1b52eedcba77d189f3fe12bcda06cff13ddb39eade88d34b85bb46fae39d1731',
        max_rate_limit_wait: 90,
      })
      .getSpace(contentfulConfig.spaceId)
      .then(space => space.getEnvironment(contentfulEnvironmentId))
      .then(environment => {
        environment
          .getEntries({
            content_type: contentTypeId,
            limit: contentCountLimit,
            'sys.archivedAt[exists]': archived,
            'sys.publishedAt[exists]': published,
            'sys.id[nin]': defaultExcludedEntries.concat(failedEntryIdList).join(','),
          })
          .then(entries => {
            resolve(entries)
          })
      })
  })
}

async function draftPublishedEntries(entries) {
  let remainingEntries = entries.total - defaultExcludedEntries.concat(failedEntryIdList).length
  processStart(remainingEntries)
  entries.items.map(entry => {
    if (remainingEntries > 0) {
      entry
        .unpublish()
        .then(res => {
          successCount++
        })
        .catch(err => {
          failedEntryIdList.push(entry.sys.id)
          failCount++
        })
    } else {
      return
    }
  })
  processUpdate(remainingEntries)
}

async function deleteDraftedEntries(entries) {
  let remainingEntries = entries.total - defaultExcludedEntries.concat(failedEntryIdList).length
  processStart(remainingEntries)
  entries.items.map(entry => {
    //if (remainingEntries > 0 && entry.fields && entry.fields.title && !entry.fields.title['en-US'].includes('DEV -')) {
    if (remainingEntries > 0 && entry) {
      entry
        .delete()
        .then(res => {
          successCount++
        })
        .catch(err => {
          failedEntryIdList.push(entry.sys.id)
          failCount++
        })
    } else {
      return
    }
  })
  processUpdate(remainingEntries)
}

async function publishDraftedEntries(entries) {
  let remainingEntries = entries.total - defaultExcludedEntries.concat(failedEntryIdList).length
  processStart(remainingEntries)
  entries.items.map(entry => {
    if (remainingEntries > 0) {
      entry
        .publish()
        .then(res => {
          successCount++
        })
        .catch(err => {
          failedEntryIdList.push(entry.sys.id)
          failCount++
        })
    } else {
      return
    }
  })
  processUpdate(remainingEntries)
}

async function processStart(total) {
  console.log(`Total ${ contentTypeId } Entries: ${ total }`)
  console.log('\x1b[32m%s\x1b[0m %s', 'queing', contentCountLimit)
}
async function processUpdate(remainingEntries) {
  console.log('\x1b[32m%s\x1b[0m %s', 'succeeded', successCount)
  console.log(
    '\x1b[31mfailed\x1b[0m %s | Total Failures: \x1b[31m%s\x1b[0m| Failed Entries: \x1b[31m%s\x1b[0m',
    failCount,
    defaultExcludedEntries.concat(failedEntryIdList).length,
    failedEntryIdList.join(',')
  )
  await sleep(1000)
  if (remainingEntries <= 0) {
    console.log('\x1b[32mProcess Completed\n\x1b[0mFailed Entries:\n\x1b[31m%s\x1b[0m', failedEntryIdList.join(','))
  } else {
    updateContentful()
  }
}

async function sleep(milliseconds) {
  var start = new Date().getTime()
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break
    }
  }
}
