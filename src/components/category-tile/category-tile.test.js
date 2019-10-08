import React from 'react'
import renderer from 'react-test-renderer'
import { StaticQuery } from 'gatsby'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import CategoryTile from './category-tile'

const categoryTileData = {
  name: 'test-category-tile',
  image: {
    file: {
      url: '/test-image',
    },
  },
  mobileImage: {
    file: {
      url: '/test-image-mobile',
    },
  },
  link: {
    text: 'test category tile link',
  },
  collapsed: false,
  collapsedImageTop: false,
  onSale: false,
}

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      contentfulCategoryTile: categoryTileData,
    })
  )
})

describe('CategoryTile', () => {
  const testProps = {
    isMobile: false,
    category: categoryTileData,
  }

  it('renders correctly with default props', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...testProps } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is true', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ ...testProps, isMobile: true } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is true and there is no mobile image', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, mobileImage: null }, isMobile: true } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is false and there is no mobile image', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, mobileImage: null } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is true and there is no image or mobile image', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, mobileImage: null, image: null }, isMobile: true } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is false and is collapsed', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, collapsed: true } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is false and is collapsed image top', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, collapsedImageTop: true } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is false and is collapsed and collapsed image top', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, collapsed: true, collapsedImageTop: true } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is false and is on sale', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CategoryTile { ...{ category: { ...categoryTileData, onSale: true } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
