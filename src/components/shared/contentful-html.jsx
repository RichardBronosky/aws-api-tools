import React, { PureComponent } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

export default class Html extends PureComponent {
  render() {
    const html = this.props.data
    return (
      <div className="contentful-html">
        { html.css && <Helmet style={ [{ type: 'text/css', cssText: html.css.css }] } /> }
        { html.script && <Helmet script={ [{ type: 'text/javascript', innerHTML: html.script.script }] } /> }
        { html.htmlText && <div dangerouslySetInnerHTML={ { __html: html.htmlText.htmlText } } /> }
      </div>
    )
  }
}

export const htmlFragment = graphql`
  fragment ContentfulHtml on ContentfulHtml {
    css {
      css
    }
    script {
      script
    }
    htmlText {
      htmlText
    }
    contentful_id
    __typename
  }
`
