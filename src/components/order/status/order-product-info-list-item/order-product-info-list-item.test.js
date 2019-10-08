import React from 'react'
import renderer from 'react-test-renderer'
import OrderProductInfoListItem from '../order-product-info-list-item'
import { orderStatus } from '@mocks/orderStatusDataMocks'

describe('OrderProductInfoListItem', () => {
  const testProps = {
    product: orderStatus.LineItems.LineItem[0],
    classname: 'test classname',
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<OrderProductInfoListItem { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product does not exist', () => {
    const tree = renderer.create(<OrderProductInfoListItem { ...{ ...testProps, product: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when classname does not exist', () => {
    const tree = renderer.create(<OrderProductInfoListItem { ...{ ...testProps, classname: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
