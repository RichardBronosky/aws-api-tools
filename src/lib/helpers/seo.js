import { titleCase } from './string-helper'
import { searchHasRefinements } from './search'

export const refinementsToTitle = (refinements, appendedText) => {
  let title = []
  if (searchHasRefinements(refinements)) {
    for (let refinement in refinements.refinementList) {
      const ref = refinements.refinementList[refinement]
      if (ref && !ref.includes('true') && !ref.includes('false')) {
        title.unshift(titleCase(ref.join(' & ')))
      }
    }
  }
  return `${ title.join(' ') }${ appendedText ? ` ${ appendedText }` : '' }`
}

export const seoPageHeadingFromContentfulSeo = page => {
  if (page.data && page.data.contentfulPage && page.data.contentfulPage.seo) {
    return page.data.contentfulPage.seo.pageHeading
  }
  return null
}
