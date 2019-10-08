import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import * as generalHelper from '../../../lib/helpers/general'

jest.mock('../../header/header', () => 'Header')
jest.mock('../../shared/query-rule-custom-data', () => 'QueryRuleCustomData')
jest.mock('../../search/search-results', () => 'SearchResults')
jest.mock('../../footer', () => 'Footer')

import LayoutChildren from '../layout-children'

describe('LayoutChildren', () => {
  const testProps = {
    cartQuantity: 1,
    shadowBox: false,
    data: {
      checkout: false,
      searchResults: false,
      pageContext: null,
      children: [<div key="test">test child component</div>],
      cartPage: false,
      scrolled: false,
      fadeOut: false,
    },
  }

  it('renders correctly with default props', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <LayoutChildren { ...testProps } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when scrolled', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <LayoutChildren { ...{ ...testProps, data: { ...testProps.data, scrolled: true } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when showing search results', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <LayoutChildren { ...{ ...testProps, data: { ...testProps.data, searchResults: true } } } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('run attemptScrollToTop when simulating click for scroll to top', () => {
    const tree = renderer.create(
      <Provider store={ store }>
        <LayoutChildren { ...{ ...testProps, data: { ...testProps.data, scrolled: true } } } />
      </Provider>
    )
    generalHelper.attemptScrollToTop = jest.fn()
    tree.root.findByProps({ className: 'scroll-to-top fade-in' }).props.onClick()
    expect(generalHelper.attemptScrollToTop).toHaveBeenCalled()
  })
})
