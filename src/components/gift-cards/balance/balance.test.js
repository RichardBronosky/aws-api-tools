import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '@redux/store'
import GiftCardBalance from './index'
import * as balanceHelper from './balance-helper'
import * as gcService from '@services/gift-card'
import * as announceHelper from '@helpers/aria-announce'

describe('GiftCardBalance', () => {
  const e = { preventDefault: jest.fn() }

  it('renders correctly when desktop', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <GiftCardBalance isMobile={ false } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when mobile', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <GiftCardBalance isMobile={ true } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('simulates onChange for gift card number', () => {
    const tree = renderer.create(
      <Provider store={ store }>
        <GiftCardBalance isMobile={ false } />
      </Provider>
    )
    renderer.act(() =>
      tree.root.findByProps({ name: 'gift_card_number' }).props.onChange({ target: { value: 'test' } })
    )
  })

  it('simulates onChange for gift card pin', () => {
    const tree = renderer.create(
      <Provider store={ store }>
        <GiftCardBalance isMobile={ false } />
      </Provider>
    )
    renderer.act(() => tree.root.findByProps({ name: 'gift_card_pin' }).props.onChange({ target: { value: 'test' } }))
  })

  it('submitGC errors when invalid card number', () => {
    announceHelper.announce = jest.fn()
    const setError = jest.fn()
    const setLoading = jest.fn()
    const setBalance = jest.fn()
    balanceHelper.submitGC(e, '1234', '1234', setError, setLoading, setBalance)
    expect(setError).toHaveBeenCalledWith('*The card number or pin entered are invalid. Please verify and try again.')
    expect(announceHelper.announce).toHaveBeenCalled()
    expect(setLoading).toHaveBeenCalled()
  })

  it('submitGC errors when when account is closed', () => {
    gcService.balanceInquiry = jest.fn(() =>
      Promise.reject({
        response: {
          data: {
            error: 'Account closed',
          },
        },
      })
    )
    announceHelper.announce = jest.fn()
    const setError = jest.fn()
    const setLoading = jest.fn()
    const setBalance = jest.fn()
    balanceHelper.submitGC(e, '1234123412341234', '12341234', setError, setLoading, setBalance)
    expect(setLoading).toHaveBeenCalled()
  })

  it('submitGC errors when bad api response', () => {
    gcService.balanceInquiry = jest.fn(() => Promise.reject())
    announceHelper.announce = jest.fn()
    const setError = jest.fn()
    const setLoading = jest.fn()
    const setBalance = jest.fn()
    balanceHelper.submitGC(e, '1234123412341234', '12341234', setError, setLoading, setBalance)
    expect(setLoading).toHaveBeenCalled()
  })

  it('submitGC sets balance when there is a gift card balance', () => {
    gcService.balanceInquiry = jest.fn(() =>
      Promise.resolve({
        giftCardBalance: '500',
      })
    )
    announceHelper.announce = jest.fn()
    const setError = jest.fn()
    const setLoading = jest.fn()
    const setBalance = jest.fn()
    balanceHelper.submitGC(e, '1234123412341234', '12341234', setError, setLoading, setBalance)
    expect(setLoading).toHaveBeenCalled()
  })

  it('simulates onClick for form submission', () => {
    balanceHelper.submitGC = jest.fn()
    const tree = renderer.create(
      <Provider store={ store }>
        <GiftCardBalance isMobile={ false } />
      </Provider>
    )
    tree.root.findByProps({ className: 'primary' }).props.onClick()
  })
})
