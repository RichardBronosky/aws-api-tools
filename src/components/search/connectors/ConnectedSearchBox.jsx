import React from 'react'
import { connect } from 'react-redux'
import { setShowSearchResults } from '../../../redux/modules/global.js'
import '../../../assets/css/components/search/connectors/search-box.sass'
import { addToDataLayer } from '../../../lib/helpers/google-tag-manager'
import { keyboardBlur } from '../../../lib/helpers/input-helper'
import { paramsIncludeKey } from '../../../lib/helpers/string-helper.js'

class SearchBox extends React.Component {
  timerId = null

  state = {
    value: this.props.currentRefinement && paramsIncludeKey('search') ? this.props.currentRefinement : '',
  }

  onChangeDebounced = event => {
    event.preventDefault()
    const { refine, delay, showSearchResults, onSetShowSearchResults } = this.props
    const value = event.currentTarget.value

    window.clearTimeout(this.timerId)
    this.timerId = window.setTimeout(() => {
      refine(value)
      if (!showSearchResults) {
        onSetShowSearchResults(true)
      }
    }, delay)

    this.setState(() => ({
      value,
    }))
  }

  render() {
    const { value } = this.state

    return (
      <div className="ais-SearchBox">
        <form
          className="ais-SearchBox-form"
          role="search"
          onSubmit={ e => {
            e.preventDefault()
            addToDataLayer('submit', 'site search', 'submit', value)
          } }
        >
          <input
            type="search"
            aria-label="Search"
            aria-describedby={ value ? 'searchResultsCount' : null }
            placeholder="SEARCH"
            className="ais-SearchBox-input"
            value={ value }
            onChange={ this.onChangeDebounced }
            onBlur={ e => {
              addToDataLayer('blur', 'site search', 'blur', value)
            } }
            onKeyDown={ e => keyboardBlur(e) }
          />
          { value && (
            <>
              <a
                className="skip"
                role="button"
                href="#"
                onClick={ e => {
                  e.preventDefault()
                  document.getElementById('productResultsWrapper').focus()
                } }
              >
                Skip to Search Results
              </a>
              <button
                type="reset"
                title="Clear the search query."
                className="ais-SearchBox-reset"
                hidden=""
                onClick={ e => {
                  this.setState({ value: '' })
                  this.onChangeDebounced(e)
                } }
              >
                <svg
                  className="ais-SearchBox-resetIcon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  width="10"
                  height="10"
                  alt=""
                  aria-hidden="true"
                  role="presentation"
                >
                  <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z" />
                </svg>
              </button>
            </>
          ) }
          { !value && (
            <button
              type="submit"
              title="Submit the search query."
              className="ais-SearchBox-submit"
              hidden=""
              onClick={ e => {
                this.onChangeDebounced
              } }
            >
              <svg
                className="ais-SearchBox-submitIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 40 40"
                aria-hidden="true"
                role="presentation"
              >
                <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z" />
              </svg>
            </button>
          ) }
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { showSearchResults: state.global.showSearchResults }
}
const mapDispatchToProps = dispatch => {
  return {
    onSetShowSearchResults: showSearchResults => dispatch(setShowSearchResults(showSearchResults)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBox)
