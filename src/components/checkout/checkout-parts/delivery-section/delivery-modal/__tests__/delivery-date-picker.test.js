import React from 'react'
import renderer from 'react-test-renderer'
import DeliveryDatePicker from '../delivery-date-picker'
import * as storeLocatorHelper from '../../../../../../lib/helpers/store-locator'
import { order1 } from '../../../../../../lib/mocks/checkoutDataMocks'
import { mockStore1 } from '../../../../../../lib/mocks/storeDataMocks'

describe('DeliveryDatePicker', () => {
  const testProps = {
    dates: [
      {
        date: '2019-07-27',
        readable: 'July 27',
        dayOfWeek: 'Sat',
        isPickup: false,
        isStandardDelivery: true,
        isExpressDelivery: false,
      },
    ],
    selectedDate: '2019-07-27',
    setSelectedDate: jest.fn(),
    pickup: false,
    order: order1,
  }

  it('renders correctly when not pickup or express delivery date selected', () => {
    const tree = renderer.create(<DeliveryDatePicker { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when express delivery date selected', () => {
    const newTestProps = {
      ...testProps,
      dates: [
        {
          date: '2019-07-27',
          readable: 'July 27',
          dayOfWeek: 'Sat',
          isPickup: false,
          isStandardDelivery: true,
          isExpressDelivery: true,
        },
      ],
    }
    const tree = renderer.create(<DeliveryDatePicker { ...newTestProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when pickup date selected', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockStore1)
    const newTestProps = {
      ...testProps,
      dates: [
        {
          date: '2019-07-27',
          readable: 'July 27',
          dayOfWeek: 'Sat',
          isPickup: true,
          isStandardDelivery: true,
          isExpressDelivery: false,
        },
      ],
      pickup: true,
    }
    const tree = renderer.create(<DeliveryDatePicker { ...newTestProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
