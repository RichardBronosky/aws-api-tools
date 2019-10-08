import React from 'react'
import renderer from 'react-test-renderer'
import CheckoutErrorMessage from '../checkout-error-message'

describe('CheckoutErrorMessage', () => {
  const testProps = {
    invalidFields: [],
    customMessage: null,
  }

  it('does not render without invalid fields or custom message', () => {
    const tree = renderer.create(<CheckoutErrorMessage { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with 1 invalid field', () => {
    const newTestProps = {
      ...testProps,
      invalidFields: ['phone'],
    }
    const tree = renderer.create(<CheckoutErrorMessage { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with 2 invalid fields', () => {
    const newTestProps = {
      ...testProps,
      invalidFields: ['first name', 'phone'],
    }
    const tree = renderer.create(<CheckoutErrorMessage { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with 3 invalid fields', () => {
    const newTestProps = {
      ...testProps,
      invalidFields: ['first name', 'last name', 'phone'],
    }
    const tree = renderer.create(<CheckoutErrorMessage { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with 4 invalid fields', () => {
    const newTestProps = {
      ...testProps,
      invalidFields: ['first name', 'last name', 'phone', 'zip'],
    }
    const tree = renderer.create(<CheckoutErrorMessage { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with custom error message and no invalid fields', () => {
    const newTestProps = {
      ...testProps,
      customMessage: 'Test error message',
    }
    const tree = renderer.create(<CheckoutErrorMessage { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with custom error message and invalid fields (should not show invalid fields)', () => {
    const newTestProps = {
      invalidFields: ['first name', 'last name', 'phone', 'zip'],
      customMessage: 'Test error message',
    }
    const tree = renderer.create(<CheckoutErrorMessage { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
