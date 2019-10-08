exports.hasSearchQuery = function(content) {
  let containsSearch = false
  if (content) {
    for (let section of content) {
      containsSearch = section.__typename == 'ContentfulSearchQuery' ? true : containsSearch
    }
  }
  return containsSearch
}

const validPublishDate = content => {
  if (content && content.startDate) {
    const startTime = new Date(content.startDate).getTime()
    const endTime = new Date(content.endDate).getTime()
    const nowTime = Date.now()
    if (nowTime > endTime) {
      return false
    }
    return nowTime > startTime
  }
  return true
}
exports.validPublishDate = validPublishDate

exports.canPublishContent = content => {
  if (Array.isArray(content)) {
    for (let i = 0; i < content.length; i++) {
      if (validPublishDate(content[i])) {
        return true
      }
    }
    return false
  }
  return validPublishDate(content)
}

exports.selectRegionBasedContent = (region, allPageContent) => {
  if (allPageContent) {
    if (region) {
      if (region === 'SE' && allPageContent.contentSe) {
        return allPageContent.contentSe
      }
      if (region === 'FL' && allPageContent.contentFl) {
        return allPageContent.contentFl
      }
      if (region === 'TX' && allPageContent.contentTx) {
        return allPageContent.contentTx
      }
      if (region === 'Oom' && allPageContent.contentOom) {
        return allPageContent.contentOom
      }
    }
    return allPageContent.contentDefault
  }
}

exports.contentfulImage = url => {
  const params = url.split('?')
  const path = url.split('/')
  return `${ process.env.GATSBY_S3_IMAGE_URL }${ path[path.length - 1] }?cache-id=${ path[path.length - 2] }${
    params[1] ? `&${ params[1] }` : ''
  }`
}
