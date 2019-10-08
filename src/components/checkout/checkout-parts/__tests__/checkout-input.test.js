import React from 'react'
import renderer from 'react-test-renderer'
import CheckoutInput from '../checkout-input'

describe('CheckoutInput', () => {
  const testProps = {
    className: 'test',
    type: 'text',
    field: 'testField',
    label: 'Test Label',
    info: 'testInfo',
    setInfo: jest.fn(),
    afterComponent: null,
    name: 'Test Name',
    radioValue: null,
    invalidFields: [],
    required: false,
  }

  it('renders correctly as a standard text input', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly as a email type input', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } type="email" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly as a tel type input', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } type="tel" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly as a radio type input', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } type="radio" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly as a text type input with invalid data', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } invalidFields={ ['testField'] } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly as a radio type input an after component', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } afterComponent={ <p>after component test</p> } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly as a text type input that is required', () => {
    const tree = renderer.create(<CheckoutInput { ...testProps } required />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  // it('renders correctly while loading', () => {
  //   const newTestProps = {
  //     ...testProps,
  //     loading: true,
  //   }
  //   const tree = renderer.create(<CheckoutInput { ...newTestProps } />).toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
})
