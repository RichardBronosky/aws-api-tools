import React from 'react'
import renderer from 'react-test-renderer'
import ReactModal from 'react-modal'
import AddressSuggestionModal from './index'
import * as globalCheckoutHelper from '@helpers/checkout/global'
import { order1 } from '@mocks/checkoutDataMocks'

ReactModal.setAppElement('*')

describe('AddressSuggestionModal', () => {
  const testProps = {
    modalOpen: true,
    order: order1,
    suggestion: '1234 Test Address, Atlanta GA 30328',
    closeModal: jest.fn(),
    setBillingState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<AddressSuggestionModal { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls acceptAddressSuggestion when user chooses to keep entered address', () => {
    const tree = renderer.create(<AddressSuggestionModal { ...testProps } />)
    globalCheckoutHelper.acceptAddressSuggestion = jest.fn()
    tree.root.findByProps({ className: 'accept-btn' }).props.onClick()
    expect(globalCheckoutHelper.acceptAddressSuggestion).toHaveBeenCalled()
  })

  it('calls declineAddressSuggestion when user chooses to keep entered address', () => {
    const tree = renderer.create(<AddressSuggestionModal { ...testProps } />)
    globalCheckoutHelper.declineAddressSuggestion = jest.fn()
    tree.root.findByProps({ className: 'keep-btn' }).props.onClick()
    expect(globalCheckoutHelper.declineAddressSuggestion).toHaveBeenCalled()
  })
})
