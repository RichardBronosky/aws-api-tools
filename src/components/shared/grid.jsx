import React, { Component } from 'react'
import { graphql } from 'gatsby'
import classNames from 'classnames'
import { CreateContent } from '../../lib/helpers/contentful-mapping'
import { genKey } from '../../lib/helpers/string-helper'

export default class Grid extends Component {
  render() {
    let content = CreateContent(this.props.data.content, null, true)
    let contentComponents = []
    for (let i = 0, n = content.length; i < n; i++) {
      contentComponents.push(
        <div
          className={ classNames('cell', 'small-12', `large-${ 12 / this.props.data.columns }`, {
            'medium-6': this.props.data.columns !== 3,
            'medium-12': this.props.data.columns === 3,
          }) }
          key={ `${ i }${ content[i].contentful_id }` }
        >
          { content[i] }
        </div>
      )
    }

    return (
      <>
        { this.props.data.content && (
          <div className={ classNames('grid-container') } key={ this.props.data.content.key }>
            <div className={ classNames('grid-x', 'grid-margin-x', 'grid-margin-y') } key={ `grid- ${ genKey() }` }>
              { contentComponents }
            </div>
          </div>
        ) }
      </>
    )
  }
}

export const sliderFragment = graphql`
  fragment Grid on ContentfulGridXHorizontal {
    startDate
    endDate
    content {
      __typename
      ...CategoryTile
      ...ProductTile
      ...CollectionTile
      ...Coupon
      ...Markdown
    }
    columns
    contentful_id
  }
`
