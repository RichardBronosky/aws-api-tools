import React, { Component } from 'react'
import classNames from 'classnames'
import { orderBy } from 'lodash'
import { connect } from 'react-redux'
import ConnectedRefinementList from './connectors/ConnectedRefinementList'
import '../../assets/css/components/search/search-filters.sass'
import ConnectedCurrentRefinements from './connectors/ConnectedCurrentRefinements'
import ConnectedClearRefinements from './connectors/ConnectedClearRefinements'
import { removeFirstAndLastSlash } from '../../lib/helpers/string-helper'

class SearchFilters extends Component {
  state = {
    attributes: [],
    subSearchIsActive: false,
    filterListActive: false,
    mobileFilterActive: false,
    activeFilter: '',
    filterItemListActive: false,
    pathname: '',
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
    this.setState({
      pathname: window.location.pathname,
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (this.node && !this.node.contains(event.target) && this.state.activeFilter !== '') {
      this.setState({ activeFilter: '' })
    }
  }

  displayFilterOnClick() {
    this.setState({ filterListActive: !this.state.filterListActive })
  }

  displayActiveFilter(filter, e) {
    filter === this.state.activeFilter ? this.setState({ activeFilter: '' }) : this.setState({ activeFilter: filter })
    try {
      if (e.currentTarget.classList.contains('search-toggle-filter')) {
        e.currentTarget.previousSibling.focus()
      }
    } catch (e) {}
  }

  render() {
    let pathname = removeFirstAndLastSlash(this.state.pathname || this.props.matchPath)
    return (
      <div
        ref={ node => {
          this.node = node
        } }
      >
        <button
          className={ classNames('filter-btn active', { active: this.props.isMobile }) }
          onClick={ this.displayFilterOnClick.bind(this) }
        >
          filter
        </button>
        <div
          className={ classNames('search-filters sidebar', {
            active: this.state.filterListActive || !this.props.isMobile,
          }) }
          role="navigation"
          aria-label="Filter Results"
          tabIndex="-1"
        >
          <ul
            className={ classNames('filterList ', {
              mobileFilterActive: this.props.isMobile,
              desktopFilterActive: !this.props.isMobile,
              search: this.state.pathname.includes('/search'),
            }) }
          >
            <li className="dropdown display-none">
              <button className="done-button" onClick={ this.displayFilterOnClick.bind(this) }>
                DONE
              </button>
              { this.state.mobileFilterActive && <div className="mobileFilterActive" /> }
            </li>
            <li className="dropdown display-none filter-by-card">
              <button className="dropbtn cell filter-by">FILTER BY </button>
              <ConnectedClearRefinements />
            </li>
            <li className="dropdown display-none">
              <ConnectedCurrentRefinements pathname={ pathname } />
            </li>
            { this.props.attributes &&
              this.props.attributes.map((attribute, index) => (
                <ConnectedRefinementList
                  key={ index }
                  attribute={ attribute }
                  activeFilter={ this.state.activeFilter }
                  displayActiveFilter={ this.displayActiveFilter.bind(this) }
                  transformItems={ items => orderBy(items, ['label', 'count'], ['asc', 'desc']) }
                  pathname={ pathname }
                />
              )) }
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}
export default connect(
  mapStateToProps,
  null
)(SearchFilters)
