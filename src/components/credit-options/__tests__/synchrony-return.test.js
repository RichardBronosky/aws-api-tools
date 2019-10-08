import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import SynchronyReturn from '../synchrony-return'

describe('SynchronyReturn', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <SynchronyReturn />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
