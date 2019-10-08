import React from 'react'
import { connectPagination } from 'react-instantsearch-dom'
import { saveLocalStorage } from '@helpers/storage'
import '@assets/css/components/product/product-pagination.sass'
import classNames from 'classnames'

export class ConnectedPagination extends React.Component {
  updatePage(newPage) {
    let page = this.props.currentRefinement
    if (newPage) {
      page = newPage
    }
    saveLocalStorage('rtg_scroll', {})
    this.props.refine(page)
    if (typeof window !== 'undefined') {
      window.history.pushState({}, null, `${ window.location.pathname + '?page=' + page }`)
      window.scrollTo(0, 0)
    }
    try {
      document.getElementById("productResultsWrapper").focus()
    } catch (error) {}
  }

  render() {
    const { nbPages, padding, currentRefinement } = this.props
    const currentPage = currentRefinement
    const start = currentPage - padding > 0 ? currentPage - padding : 1
    const end = currentPage + padding + 1 < nbPages ? currentPage + padding + 1 : nbPages
    const pageRange = Array.from({ length: end + 1 - start }, (a, b) => b + start)
    const isCurrent = page => (currentPage === page ? true : null)
    const pageOptions = pageRange.map((page, index) => (
      <li key={ `${ page }${ index }` }>
        <a
          href="#"
          onClick={ () => this.updatePage(page) }
          className={ classNames({ 'active-page': isCurrent(page) || !isCurrent(page) === 1 }) }
          aria-current={ isCurrent(page) }
        >
          <span className="hide508">Page </span>
          { page }
        </a>
      </li>
    ))

    return (
      <div className="plp-pagination">
        <nav role="navigation" aria-label="Pagination" tabIndex="0">
          { currentPage > 1 && (
            <a className="arrow" aria-label="Next Page" onClick={ () => this.updatePage(currentPage - 1) }>
              <span aria-hidden="true">‹</span>
            </a>
          ) }
          <ul>{ pageOptions }</ul>
          { currentPage < nbPages && (
            <a role="link" tabIndex="0" className="arrow" aria-label="Next Page" onClick={ () => this.updatePage(currentPage + 1) }>
              <span aria-hidden="true">›</span>
            </a>
          ) }
        </nav>
      </div>
    )
  }
}

export default connectPagination(ConnectedPagination)
