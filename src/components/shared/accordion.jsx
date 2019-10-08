import React, { PureComponent } from 'react'
import { graphql } from 'gatsby'
import classNames from 'classnames'
import '../../assets/css/components/shared/accordion.sass'

export default class Accordion extends PureComponent {
  state = { accordionVisible: !this.props.data.hidden }

  toggleContent() {
    this.setState({ accordionVisible: !this.state.accordionVisible })
  }

  onKeyDown = event => {
    let code = event.keyCode || event.which
    if (code === 13 || code === 32) {
      this.toggleContent()
    }
    if (code === 27) {
      this.setState({ accordionVisible: false })
    }
  }

  render() {
    const accordion = this.props.data
    const { children } = this.props
    const accordionID = accordion.contentful_id ? accordion.contentful_id : accordion.id
    return (
      <div
        className={ classNames('contentful-accordion', {
          small: accordion.accordionStyle === 'Small',
        }) }
      >
        <div
          className={ classNames('contentful-accordion-heading') }
          onClick={ this.toggleContent.bind(this) }
          tabIndex="0"
          role="button"
          aria-expanded={ this.state.accordionVisible }
          aria-controls={ accordionID }
          onKeyDown={ e => this.onKeyDown(e) }
        >
          <span>{ accordion.heading }</span>
          <i className={ classNames({ active: this.state.accordionVisible }) } />
        </div>
        { accordion.markdown && accordion.markdown.childMarkdownRemark && (
          <div
            id={ accordionID }
            role="region"
            tabIndex="-1"
            className={ classNames('contentful-accordion-content', {
              active: this.state.accordionVisible,
            }) }
            dangerouslySetInnerHTML={ {
              __html: accordion.markdown.childMarkdownRemark.html,
            } }
          />
        ) }
        { children && (
          <div
            className={ classNames('contentful-accordion-content', {
              active: this.state.accordionVisible,
            }) }
          >
            { children }
          </div>
        ) }
      </div>
    )
  }
}

export const accordionFragment = graphql`
  fragment Accordion on ContentfulAccordion {
    name
    startDate
    endDate
    heading
    markdown {
      childMarkdownRemark {
        html
      }
    }
    hidden
    accordionStyle
    contentful_id
    __typename
  }
`
