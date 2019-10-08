import React from 'react'
import classNames from 'classnames'
import { connectSearchBox } from 'react-instantsearch/connectors'
import SearchBox from '../search/connectors/ConnectedSearchBox'
import '../../assets/css/components/shared/search-form.sass'
const DebouncedSearchBox = connectSearchBox(SearchBox)

export default ({ id, addClasses }) => (
  <div key={ id } className={ classNames('search-form', addClasses) }>
    <DebouncedSearchBox delay={ 500 } />
  </div>
)
