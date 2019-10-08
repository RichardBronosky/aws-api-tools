import React from 'react'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'
import CategoryTile from './category-tile'

class CategoryTileWrapper extends React.PureComponent {
  render() {
    const { data, isMobile } = this.props
    return <CategoryTile category={ data } isMobile={ isMobile } />
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}

export default connect(mapStateToProps)(CategoryTileWrapper)

export const CategoryTileFragment = graphql`
  fragment CategoryTile on ContentfulCategoryTile {
    name
    onSale
    collapsed
    collapsedImageTop
    image {
      ...Image
    }
    mobileImage {
      ...Image
    }
    link {
      ...Link
    }
    fontColor
    contentful_id
    __typename
  }
`
