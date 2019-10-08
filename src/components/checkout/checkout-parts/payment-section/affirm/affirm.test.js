import React from 'react'
import renderer from 'react-test-renderer'
import Affirm from './affirm-button'

describe('Affirm', () => {
  const testProps = {
    affirmLoaded: false,
    affirmFunc: jest.fn(),
    affirm_config: {
      public_api_key: 'test-key',
      script: `test-url/js/v2/affirm.js`,
    },
  }

  beforeAll(() => {
    global.window = Object.create(window)
    Object.defineProperty(window, 'affirm', {
      checkout: jest.fn(),
      open: jest.fn(),
    })
  })

  it('renders correctly when affirm is not loaded', () => {
    const tree = renderer.create(<Affirm { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when affirm is loaded', () => {
    const tree = renderer.create(<Affirm { ...{ ...testProps, affirmLoaded: true } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
