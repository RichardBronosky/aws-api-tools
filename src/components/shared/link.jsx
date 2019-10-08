import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { graphql, Link } from 'gatsby'
import { checkProp } from '../../lib/helpers/check-prop.js'
import { savePageScroll } from '../../lib/helpers/product.js'
import { setShowSearchResults } from '../../redux/modules/global.js'

class RTGLink extends PureComponent {
  render() {
    const { onSetShowSearchResults } = this.props
    const link = this.props.data
    const content =
      React.Children.count(this.props.children) === 0
        ? link && link.displayText
          ? link.displayText
          : link.text
        : this.props.children

    if (link) {
      const uri = link.url ? link.url : link.slug
      const gtm = {
        category: link.category ? link.category : this.props.category ? this.props.category : null,
        action: link.action ? link.action : this.props.action ? this.props.action : null,
        label: link.label ? link.label : this.props.label ? this.props.label : uri,
        value: link.value ? link.value : this.props.value ? this.props.value : null,
      }
      const linkStyle = link.textColor ? { color: link.textColor } : this.props.style
      if (link.url) {
        return (
          <a
            href={ this.props.disabled ? null : link.url }
            title={ link.title ? link.title : link.altDesc }
            className={ this.props.className }
            target={ link.target ? link.target : checkProp(this.props.target) }
            key={ link.id }
            style={ linkStyle }
            rel={ link.rel }
            gtm-category={ gtm.category }
            gtm-action={ gtm.action }
            gtm-label={ gtm.label }
            gtm-value={ gtm.value }
            aria-label={ checkProp(this.props['aria-label'], this.props.noAriaLabel, link.altDesc) }
            aria-labelledby={ checkProp(this.props['aria-labelledby']) }
            aria-hidden={ this.props['aria-hidden'] }
            aria-selected={ checkProp(this.props['aria-selected'], this.props.noAriaSelected) }
            disabled={ this.props.disabled }
            onClick={ () => {
              onSetShowSearchResults(false)
              savePageScroll()
              return this.props.trackingData ? window.dataLayer.push(this.props.trackingData) : null
            } }
          >
            { content }
          </a>
        )
      }
      if (link.internalUrl || link.slug) {
        const url = link.internalUrl ? link.internalUrl.url : link.slug
        return (
          <Link
            to={ url }
            key={ link.id }
            id={ checkProp(this.props.id) }
            className={ this.props.className }
            target={ link.target ? link.target : checkProp(this.props.target) }
            style={ linkStyle }
            title={ link.title ? link.title : link.altDesc }
            rel={ link.rel }
            gtm-category={ gtm.category }
            gtm-action={ gtm.action }
            gtm-label={ gtm.label }
            gtm-value={ gtm.value }
            role={ checkProp(this.props.role, this.props.noRole) }
            tabIndex={ checkProp(this.props.tabIndex, this.props.noTabIndex) }
            aria-hidden={ this.props['aria-hidden'] }
            aria-checked={ this.props['aria-checked'] }
            aria-label={ checkProp(this.props['aria-label'], this.props.noAriaLabel, link.altDesc) }
            aria-labelledby={ checkProp(this.props['aria-labelledby']) }
            aria-describedby={ checkProp(this.props['aria-describedby'], this.props.noAriaDescribedby) }
            aria-expanded={ checkProp(this.props['aria-expanded'], this.props.noAriaExpand) }
            aria-selected={ checkProp(this.props['aria-selected'], this.props.noAriaSelected) }
            aria-controls={ checkProp(this.props['aria-controls'], this.props.noAriaControls) }
            aria-checked={ checkProp(this.props['aria-checked'], this.props.noAriaChecked) }
            onClick={ () => {
              onSetShowSearchResults(false)
              savePageScroll()
              return this.props.trackingData ? window.dataLayer.push(this.props.trackingData) : null
            } }
            onKeyDownCapture={ this.props.onKey
                ? e => {
                    this.props.onKey(e)
                  }
                : null }
            onFocus={ this.props.onFocus
                ? e => {
                    this.props.onFocus(e)
                  }
                : null }
            onBlur={ this.props.onBlur
                ? e => {
                    this.props.onBlur(e)
                  }
                : null }
          >
            { content }
          </Link>
        )
      }
    }
    return content
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}
const mapDispatchToProps = dispatch => {
  return {
    onSetShowSearchResults: showSearchResults => dispatch(setShowSearchResults(showSearchResults)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RTGLink)

export const link = graphql`
  fragment Link on ContentfulLink {
    id
    text
    displayText
    textColor
    internalUrl {
      url
    }
    slug
    url
    altDesc
    title
    type
    target
  }
`
