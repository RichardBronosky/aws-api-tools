import React from 'react'
import renderer from 'react-test-renderer'
import { StaticQuery } from 'gatsby'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import CollectionTile from './collection-tile'

const collectionTileData = {
  name: 'test-collection-tile',
  heading: 'Test Collection Tile',
  description: 'Test Collection Tile Description',
  image: {
    file: {
      url: '/test-image',
    },
  },
  imageAltText: 'test collection tile alt text',
  mobileImage: {
    file: {
      url: '/test-image-mobile',
    },
  },
  link: {
    text: 'test collection tile link',
  },
}

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      contentfulCollectionTile: collectionTileData,
    })
  )
})

describe('CollectionTile', () => {
  const testProps = {
    isMobile: false,
    collection: collectionTileData,
  }

  it('renders correctly with default props', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CollectionTile { ...testProps } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is true', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CollectionTile { ...{ ...testProps, isMobile: true } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is true and there is no mobile image', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CollectionTile { ...{ collection: { ...collectionTileData, mobileImage: null }, isMobile: true } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is false and there is no mobile image', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CollectionTile { ...{ collection: { ...collectionTileData, mobileImage: null } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when isMobile is true and there is no image or mobile image', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CollectionTile
            { ...{ collection: { ...collectionTileData, mobileImage: null, image: null }, isMobile: true } }
          />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
