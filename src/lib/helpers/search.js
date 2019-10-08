import { cleanSearchUrl, cleanSearchParamValue, slugGenerator, isWholeWordInStr, slugify } from './string-helper'
import { getURLParam } from './general'

export const generateFacetsURLFragment = (currentUrl, state) => {
  let url = currentUrl
  if (state.query) {
    url += cleanSearchUrl(`/keywords/${ state.query }`)
  }
  for (let refinement in state.refinementList) {
    let refinements = ['color_family', 'brand', 'category', 'material_family', 'style']
    if (refinements.includes(refinement)) {
      if (state.refinementList[refinement]) {
        url += cleanSearchUrl(`/${ refinement }/${ state.refinementList[refinement] }`)
      }
    }
  }
  return url
}

export const urlToSearchState = (rootPagePath, fullPath, displayFilters) => {
  let query
  let facetsURL = fullPath.replace(rootPagePath, '') //get rid of actual page path.
  let page = getURLParam('page') ? getURLParam('page') : 1
  let facetURLParts = facetsURL.split('/')
  facetURLParts = facetURLParts.filter(part => Boolean(part)) //filters out blank indexes
  facetURLParts = facetURLParts.map(part => part.replace(/%22/g, '"'))
  let refinementList = facetURLParts.reduce((parts, part, partIndex, original) => {
    if (original.length > partIndex + 1) {
      const partValue = cleanSearchParamValue(original[partIndex + 1])
      if (part == 'keywords') {
        query = partValue
      }
      const encodedParts = {
        color: 'color_family',
        finish: 'finish_family',
        'size-family': 'size_family',
        material: 'material_family',
        'piece-count': 'piece count',
        'sub-category': 'sub_category',
      }
      if (displayFilters && (displayFilters.includes(part) || displayFilters.includes(encodedParts[part]))) {
        if (encodedParts[part]) {
          parts[encodedParts[part]] = partValue.split(',')
        } else {
          parts[part] = partValue.split(',')
        }
      }
    }
    return parts
  }, {})
  return { refinementList, query, page, hitsPerPage: 12 }
}

export const getRefinementListFromFilters = queryFilters => {
  let filterWithValues = {}
  const facets = queryFilters.split(' AND ')
  for (var f = 0; f < facets.length; f++) {
    const filterValues = facets[f].split(' OR ')
    for (var fv = 0; fv < filterValues.length; fv++) {
      const key = filterValues[fv].split(':')[0]
      const value = filterValues[fv].split(':')[1].replace(/"/g, ``)
      if (filterWithValues[key]) {
        filterWithValues[key].push(value)
      } else {
        filterWithValues[key] = [value]
      }
    }
  }
  return filterWithValues
}

export const searchStateToUrl = (pathname, searchState) => {
  return searchState ? `${ generateFacetsURLFragment(pathname, searchState) }` : ''
}

export const searchHasRefinements = searchState => {
  return searchState && Object.keys(searchState.refinementList).length > 0
}

export const seoRelativeValue = value => {
  const whitelist = [
    'color_family',
    'material_family',
    'style',
    'size',
    'size_family',
    'decor',
    'piece count',
    'comfort',
    'technology',
  ]
  if (value && whitelist.indexOf(value) > -1) {
    return ''
  }
  return 'nofollow'
}

export const refinementPath = (pathname, item, attributeLabel) => {
  if (refinementInPath(attributeLabel)) {
    let path = ''
    const params = pathname.split('/')
    for (var i = 0; i < params.length; i++) {
      path += `${ params[i] }/`
      if (params[i] === slugify(attributeLabel)) {
        if (params[i + 1] && !params[i + 1].includes(cleanSearchUrl(item.label))) {
          params[i + 1] = `${ params[i + 1] },${ cleanSearchUrl(item.label) }`
        }
      }
    }
    return path.replace(/\/$/g, '')
  }
  return `${ pathname }${ slugGenerator(attributeLabel, item.label) }`
}

export const removeRefinementPath = (pathname, item) => {
  if (typeof window !== 'undefined') {
    pathname = window.location.pathname
  }
  let addrArr = pathname.split('/')
  for (let i = 0, n = addrArr.length; i < n; i++) {
    if (isWholeWordInStr(addrArr[i], item)) {
      addrArr[i] = addrArr[i].replace(item, '')
      if (!addrArr[i].match(/[a-z]/i)) {
        addrArr[i - 1] = ''
      }
    }
  }
  const newPath = addrArr
    .join('/')
    .replace('/,', '/')
    .replace(',/', '/')
    .replace(',,', ',')
    .replace(/\/+$/, '')
  return newPath.charAt(newPath.length - 1) === ',' ? newPath.slice(0, -1) : newPath
}

export const refinementInPath = (refinement, attribute) => {
  if (!refinement) return false
  else refinement = slugify(refinement)
  let path = ''
  if (typeof window !== 'undefined') {
    path = window.location.pathname
  }
  return attribute
    ? path.includes(refinement) && path.includes(attribute.replace('_family', ''))
    : path.includes(refinement)
}
