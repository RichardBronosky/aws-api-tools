import React from 'react'
import renderer from 'react-test-renderer'
import BillingAddress from './billing-address'
import * as paymentSectionHelper from '../../../../../lib/helpers/checkout/payment-section/payment-section'
import * as billingAddressHelper from '../../../../../lib/helpers/checkout/payment-section/billing-address'
import { order1 } from '../../../../../lib/mocks/checkoutDataMocks'

describe('BillingAddress', () => {
  let testProps = {
    order: {
      ...order1,
      payer: {
        ...order1.payer,
        billingDifferent: true,
        billingSubmitted: false,
      },
    },
    invalidFields: [],
    loading: false,
    submitBillingAddress: jest.fn(),
  }

  it('renders correctly with when user selects billing different and has not submitted', () => {
    const tree = renderer.create(<BillingAddress { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with when user selects billing different and has submitted', () => {
    const tree = renderer
      .create(
        <BillingAddress
          { ...{ ...testProps, order: { ...order1, payer: { ...order1.payer, billingSubmitted: true } } } }
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with when user selects billing not different and has not submitted', () => {
    const tree = renderer
      .create(
        <BillingAddress
          { ...{ ...testProps, order: { ...order1, payer: { ...order1.payer, billingDifferent: false } } } }
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly while loading', () => {
    const tree = renderer.create(<BillingAddress { ...{ ...testProps, loading: true } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with invalid fields', () => {
    const tree = renderer.create(<BillingAddress { ...{ ...testProps, invalidFields: ['firstName'] } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when billing submitted', () => {
    const tree = renderer
      .create(
        <BillingAddress
          { ...{ ...testProps, order: { ...order1, payer: { ...order1.payer, billingSubmitted: true } } } }
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls onChangeBillingDifferent when simulating billing address different checkbox', () => {
    billingAddressHelper.onChangeBillingDifferent = jest.fn()
    const tree = renderer.create(<BillingAddress { ...testProps } />)
    tree.root.findByProps({ className: 'billing-address-checkbox' }).props.onChange()
    expect(billingAddressHelper.onChangeBillingDifferent).toHaveBeenCalled()
  })

  it('calls onBillingStateChange when simulating changing billing address state', () => {
    billingAddressHelper.onBillingStateChange = jest.fn()
    const tree = renderer.create(<BillingAddress { ...testProps } />)
    tree.root.findByProps({ className: 'state' }).props.onChange()
    expect(billingAddressHelper.onBillingStateChange).toHaveBeenCalled()
  })

  it('calls setPayerInfo when simulating click submit', () => {
    paymentSectionHelper.setPayerInfo = jest.fn()
    const tree = renderer.create(
      <BillingAddress { ...{ ...testProps, order: { ...order1, payer: { ...order1.payer, billingSubmitted: true } } } } />
    )
    tree.root.findByProps({ className: 'edit-billing-btn' }).props.onClick()
    expect(paymentSectionHelper.setPayerInfo).toHaveBeenCalled()
  })
})
