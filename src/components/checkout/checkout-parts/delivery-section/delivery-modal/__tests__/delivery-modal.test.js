import React from 'react'
import renderer from 'react-test-renderer'
import ReactModal from 'react-modal'
import { Provider } from 'react-redux'
import { store } from '../../../../../../redux/store'
import DeliveryModal from '../delivery-modal'
import * as storeLocatorHelper from '../../../../../../lib/helpers/store-locator'
import { order1 } from '../../../../../../lib/mocks/checkoutDataMocks'
import { mockStore1 } from '../../../../../../lib/mocks/storeDataMocks'

ReactModal.setAppElement('*')

describe('DeliveryModal', () => {
  const testProps = {
    order: order1,
    modalOpen: true,
    closeModal: jest.fn(),
    setSelectedPickupDate: jest.fn(),
    setSelectedDeliveryDate: jest.fn(),
    loading: false,
    deliveryModalInfo: {
      delivery: true,
      pickup: false,
    },
    setDeliveryModalInfo: jest.fn(),
    error: '',
    deliveryCalendar: [
      {
        date: '2019-07-27',
        readable: 'July 27',
        dayOfWeek: 'Sat',
        isPickup: false,
        isStandardDelivery: true,
        isExpressDelivery: false,
      },
    ],
    selectedPickupDate: {
      date: '2019-07-27',
      readable: 'July 27',
    },
    selectedDeliveryDate: {
      date: '2019-07-27',
      readable: 'July 27',
    },
    updateDeliveryDate: jest.fn(),
  }

  it('renders correctly when open and delivery date selected', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockStore1)
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryModal { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when open and express delivery date selected', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockStore1)
    const newTestProps = {
      ...testProps,
      deliveryCalendar: [
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
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryModal { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when open and pickup date selected', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockStore1)
    const newTestProps = {
      ...testProps,
      deliveryModalInfo: {
        delivery: false,
        pickup: true,
      },
      deliveryCalendar: [
        {
          date: '2019-07-27',
          readable: 'July 27',
          dayOfWeek: 'Sat',
          isPickup: true,
          isStandardDelivery: true,
          isExpressDelivery: false,
        },
      ],
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryModal { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when not open', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockStore1)
    const newTestProps = {
      ...testProps,
      modalOpen: false,
    }
    const tree = renderer.create(<DeliveryModal { ...newTestProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
