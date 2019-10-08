import React from 'react'
import ReactModal from 'react-modal'
import renderer from 'react-test-renderer'
import CreditOptions from '../options'
import { mockFinancePlans1 } from '../../../lib/mocks/financeDataMocks'

ReactModal.setAppElement('*')

describe('CreditOptions', () => {
  const testProps = {
    promoModalOpen: false,
    postbackRefId: 'test-id',
    accountError: false,
    financePlan: mockFinancePlans1[0],
    endDate: new Date('2023-08-04'),
    onKeyDown: jest.fn(),
    setModalOpen: jest.fn(),
    accountSubmit: jest.fn(),
    setAccount: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<CreditOptions { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with an account error', () => {
    const tree = renderer.create(<CreditOptions { ...{ ...testProps, accountError: 'test error' } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when finance plan has 0 as threshold', () => {
    const tree = renderer
      .create(<CreditOptions { ...{ ...testProps, financePlan: { ...mockFinancePlans1[0], threshold: '.00' } } } />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls setModalOpen with true when simulating more info banner click', () => {
    const tree = renderer.create(<CreditOptions { ...testProps } />)
    tree.root.findByProps({ className: 'link no-margin' }).props.onClick()
    expect(testProps.setModalOpen).toHaveBeenCalledWith(true)
  })

  it('calls setModalOpen with false when simulating close banner', () => {
    const tree = renderer.create(<CreditOptions { ...{ ...testProps, promoModalOpen: true } } />)
    tree.root.findByProps({ promoMessage: testProps.financePlan.promoMessage }).props.closeModal()
    expect(testProps.setModalOpen).toHaveBeenCalledWith(false)
  })

  it("calls onKeyDown with 'test' when simulating key down", () => {
    const tree = renderer.create(<CreditOptions { ...testProps } />)
    tree.root.findByProps({ className: 'login-field' }).props.onKeyDown('test')
    expect(testProps.onKeyDown).toHaveBeenCalledWith('test')
  })

  it("calls setAccount with '1234' when simulating account number input", () => {
    const tree = renderer.create(<CreditOptions { ...testProps } />)
    tree.root.findByProps({ className: 'login-field' }).props.onChange({ target: { value: '1234' } })
    expect(testProps.setAccount).toHaveBeenCalledWith('1234')
  })

  it('calls accountSubmit when submit button is clicked', () => {
    const tree = renderer.create(<CreditOptions { ...testProps } />)
    tree.root.findByProps({ className: 'account-btn' }).props.onClick()
    expect(testProps.accountSubmit).toHaveBeenCalled()
  })
})
