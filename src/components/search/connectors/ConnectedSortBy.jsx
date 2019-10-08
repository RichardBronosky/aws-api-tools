import React from 'react'
import { connectSortBy } from 'react-instantsearch-dom'
import '../../../assets/css/components/search/connectors/sort-by.sass'
import { addToDataLayer } from '../../../lib/helpers/google-tag-manager'

export default connectSortBy(({ items, refine }) => {
  return (
    <div className="ais-SortBy">
      <select
        className="ais-SortBy-select"
        onChange={ e => {
          addToDataLayer('click', 'plp', 'sort change', e.target.value)
          refine(e.target.value)
          if (typeof window !== 'undefined' && window.location.href.includes('?page')) {
            window.history.pushState({}, null, window.location.pathname)
            window.scrollTo(0, 0)
          }
        } }
      >
        { items.map(item => (
          <option className="ais-SortBy-option" value={ item.value } key={ item.value }>
            { item.label }
          </option>
        )) }
      </select>
    </div>
  )
})
