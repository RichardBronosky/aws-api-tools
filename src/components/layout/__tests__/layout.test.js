import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../shared/instant-search-router', () => 'InstantSearchRouter')
jest.mock('../layout-children', () => 'LayoutChildren')

import Layout from '../layout'

describe('Layout', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(<Layout />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
