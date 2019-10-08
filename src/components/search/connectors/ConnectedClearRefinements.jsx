import React from 'react'
import { connectCurrentRefinements } from 'react-instantsearch-dom'
import RTGLink from '@shared/link'

const getPath = items => {
  if (typeof window !== 'undefined') {
    if (window.location.pathname.includes('/search')) {
      let path = '/search'
      let searchPathParts = window.location.pathname.split('/')
      if (searchPathParts[2] === 'keywords') {
        path = `/${ searchPathParts[1] }/${ searchPathParts[2] }/${ searchPathParts[3] ? searchPathParts[3] : '' }`
      }
      return path
    } else if (items && items.length > 0) {
      let newItems = items.map(item => {
        if (item.attribute.includes('_family')) {
          return item.attribute.split('_family')[0]
        } else {
          return item.attribute
        }
      })
      let pathname = window.location.pathname
      for (let i = 0, n = newItems.length; i < n; i++) {
        pathname = pathname.split(newItems[i]).join('')
      }
      pathname = pathname.split('//')
      return (pathname.length > 0 && pathname[0]) || '/search'
    } else {
      return window.location.pathname
    }
  } else {
    return '/search'
  }
}

export default connectCurrentRefinements(({ items }) => (
  <div className="ais-ClearRefinements">
    <RTGLink
      data={ {
        slug: getPath(items),
        text: 'Clear Filters',
        className: 'ais-ClearRefinements-button',
        category: 'plp',
        action: 'clear filters',
      } }
    />
  </div>
))
