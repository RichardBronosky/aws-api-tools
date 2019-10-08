import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import ReactModal from 'react-modal'
import BrowserDetect from './browser-detect'
import { browsers, browserData } from './index'

ReactModal.setAppElement('*')

describe('BrowserDetect', () => {
  const testProps = {
    isOpen: true,
    closeModal: jest.fn(),
    browsers: browsers,
    browserData: browserData,
    isMobile: false,
    browserName: 'IE',
    browserVersion: 10,
  }

  it('renders correctly when modal closed', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <BrowserDetect { ...{ ...testProps, isOpen: false } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when modal open and unsupported IE browser', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <BrowserDetect { ...testProps } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when modal open and unsupported Chrome browser', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <BrowserDetect { ...{ ...testProps, browserName: 'Chrome' } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when modal open and unsupported browser and isMobile', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <BrowserDetect { ...{ ...testProps, isMobile: true } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('run closeModal when continue to site button is clicked', () => {
    const tree = renderer.create(
      <Provider store={ store }>
        <BrowserDetect { ...testProps } />
      </Provider>
    )
    tree.root.findByProps({ className: 'blue-action-btn' }).props.onClick()
    expect(testProps.closeModal).toHaveBeenCalled()
  })
})
