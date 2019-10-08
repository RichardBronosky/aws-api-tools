import React from 'react'
import renderer from 'react-test-renderer'
import ShippingCosts from './shipping-costs'
import * as shippingCostsHelper from '../../../lib/helpers/shipping-costs'

describe('ShippingCosts', () => {
  const testProps = {
    zipCode: '33584',
    errorMessage: null,
    setState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<ShippingCosts { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with error message', () => {
    const tree = renderer.create(<ShippingCosts { ...{ ...testProps, errorMessage: 'test error' } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls handleSubmit when simulating form onSubmit', () => {
    const tree = renderer.create(<ShippingCosts { ...testProps } />)
    shippingCostsHelper.handleSubmit = jest.fn()
    tree.root.findByProps({ className: 'input-wrapper' }).props.onSubmit({ preventDefault: jest.fn() })
    expect(shippingCostsHelper.handleSubmit).toHaveBeenCalled()
  })

  it('calls setState when simulating input onChange', () => {
    const tree = renderer.create(<ShippingCosts { ...testProps } />)
    tree.root.findByProps({ className: 'zip-input' }).props.onChange({ target: { value: 'test' } })
    expect(testProps.setState).toHaveBeenCalled()
  })
})
