import React from 'react'
import renderer from 'react-test-renderer'
import { mockProduct1 } from '@mocks/productDataMocks'
import ProductImageZoomWrapper from './index'
import ProductImageZoom from './product-image-zoom'
import * as imageZoomHelper from './product-image-zoom-helper'
import * as announceHelper from '@helpers/aria-announce'

let container
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

describe('ProductImageZoom', () => {
  const testProps = {
    image: 'www.test-imagesrc.rtg.com/image.png',
    product: mockProduct1,
    zoom: false,
    setZoom: jest.fn(),
    zoomBtnRef: '',
    isMobile: true,
  }

  it('renders correctly with product and image', () => {
    const tree = renderer.create(<ProductImageZoomWrapper { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with product and image when zoomed', () => {
    const tree = renderer.create(<ProductImageZoom { ...{ ...testProps, zoom: true } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('handleZoomToggle calls setZoom and annouce when enter pressed', () => {
    announceHelper.taskDone = jest.fn()
    announceHelper.announce = jest.fn()
    imageZoomHelper.handleZoomToggle(
      { stopPropagation: jest.fn(), preventDefault: jest.fn(), key: 'Enter' },
      true,
      testProps.setZoom,
      {
        current: {
          setAttribute: jest.fn(),
          focus: jest.fn(),
        },
      }
    )
    expect(testProps.setZoom).toHaveBeenCalled()
    expect(announceHelper.announce).toHaveBeenCalled()
  })

  it('handleZoomToggle calls setZoom, taskDone, and annouce when escape pressed', () => {
    announceHelper.taskDone = jest.fn()
    announceHelper.announce = jest.fn()
    imageZoomHelper.handleZoomToggle(
      { stopPropagation: jest.fn(), preventDefault: jest.fn(), key: 'Escape' },
      true,
      testProps.setZoom,
      {
        current: {
          setAttribute: jest.fn(),
          focus: jest.fn(),
        },
      }
    )
    expect(testProps.setZoom).toHaveBeenCalled()
    expect(announceHelper.announce).toHaveBeenCalled()
    expect(announceHelper.taskDone).toHaveBeenCalled()
  })

  it('calls handZoomToggle when enter pressed', () => {
    imageZoomHelper.handleZoomToggle = jest.fn()
    const tree = renderer.create(<ProductImageZoom { ...testProps } />)
    tree.root.findByProps({ className: 'product-image cell small-10' }).props.onKeyDown({ key: 'Enter' })
    expect(imageZoomHelper.handleZoomToggle).toHaveBeenCalled()
  })

  it('calls handZoomToggle when clicked', () => {
    imageZoomHelper.handleZoomToggle = jest.fn()
    const tree = renderer.create(<ProductImageZoom { ...testProps } />)
    tree.root.findByProps({ className: 'product-image cell small-10' }).props.onClick()
    expect(imageZoomHelper.handleZoomToggle).toHaveBeenCalled()
  })

  it('handleWindowEvents calls taskDone', () => {
    announceHelper.taskDone = jest.fn()
    global['zoom'] = true
    global['setZoom'] = jest.fn()
    global['zoomBtn'] = {
      current: {
        setAttribute: jest.fn(),
      },
    }
    imageZoomHelper.handleWindowEvents({ preventDefault: jest.fn(), key: 'Enter' })
    expect(announceHelper.taskDone).toHaveBeenCalled()
  })
})
