import { mockStoreDispatch } from '../../../test-utils/redux'
import * as checkoutRedux from '../../../../redux/modules/checkout'
import * as globalCheckoutHelper from '../global'
import * as storeLocatorHelper from '../../store-locator'
import * as deliverySectionHelper from '../delivery-section'
import * as checkoutService from '../../../services/checkout'
import { order1, mockDeliveryCalendar } from '../../../mocks/checkoutDataMocks'
import { mockLocation1 } from '../../../mocks/locationDataMocks'
import { mockDistirbutionCenter, mockStore1, mockWarehouse1 } from '../../../mocks/storeDataMocks'

describe('shipping section checkout helper', () => {
  const initialState = {
    checkout: {
      order: {
        contact: {},
        shippingAddress: {},
      },
    },
    location: mockLocation1,
  }

  test('getDistributionCenter returns distirbution center info', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockWarehouse1)
    expect(deliverySectionHelper.getDistributionCenter(order1)).toEqual({
      distributionCenter: mockDistirbutionCenter,
    })
  })

  test('getDeliverySliderIndex returns correct slide index based on deliveryDate', () => {
    expect(
      deliverySectionHelper.getDeliverySliderIndex({ date: '2019-06-03', readable: 'June 03' }, mockDeliveryCalendar)
    ).toEqual(0)
  })

  test('getDeliverySpecificBody returns correct body when order contains rtg delivery items', () => {
    expect(deliverySectionHelper.getDeliverySpecificBody(order1)).toEqual({
      orderId: order1.orderId,
      additionalDirections: order1.additionalDirections,
      shouldCombineUPSWithTruck: true,
      deliveryDate: order1.deliveryDate,
      deliveryType: 'D',
      isPickup: order1.isPickup,
    })
  })

  test('getDeliverySpecificBody returns correct body when order does not contain rtg delivery items', () => {
    expect(
      deliverySectionHelper.getDeliverySpecificBody({
        ...order1,
        lineItems: order1.lineItems.filter(item => item.deliveryType !== 'D'),
      })
    ).toEqual({
      orderId: order1.orderId,
      additionalDirections: order1.additionalDirections,
      shouldCombineUPSWithTruck: true,
      deliveryType: 'U',
      isPickup: order1.isPickup,
    })
  })

  test('getDeliverySpecificBody returns correct body when order is pickup', () => {
    expect(
      deliverySectionHelper.getDeliverySpecificBody({
        ...order1,
        isPickup: true,
      })
    ).toEqual({
      orderId: order1.orderId,
      additionalDirections: order1.additionalDirections,
      deliveryDate: order1.deliveryDate,
      shouldCombineUPSWithTruck: true,
      deliveryType: 'D',
      isPickup: true,
    })
  })

  test('setDeliveryInfo sets correct data when changing deliveryDate', () => {
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    deliverySectionHelper.setDeliveryInfo('2019-06-05', 'deliveryDate')
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith({ ...initialState.checkout.order, deliveryDate: '2019-06-05' })
  })

  test('setDeliveryCalendar builds a full calendar including express, delivery, and pickup dates', () => {
    mockStoreDispatch(initialState)
    checkoutRedux.setDeliveryCalendar = jest.fn()
    const deliveryCalendar = mockDeliveryCalendar.map(date => {
      if (date.isStandardDelivery) {
        return date.date
      }
    })
    deliverySectionHelper.setDeliveryCalendar(deliveryCalendar, deliveryCalendar, '2019-06-03')
    expect(checkoutRedux.setDeliveryCalendar).toHaveBeenCalledWith([
      {
        date: '2019-06-03',
        dayOfWeek: 'Mon',
        isExpressDelivery: true,
        isPickup: false,
        isStandardDelivery: true,
        readable: 'June 03',
      },
      ...mockDeliveryCalendar,
    ])
  })

  test('getRoomsToGoDeliveryItems only returns rtg delivery items', () => {
    expect(deliverySectionHelper.getRoomsToGoDeliveryItems(order1.lineItems)).toEqual(
      order1.lineItems.filter(item => item.deliveryType === 'D')
    )
  })

  test('getVendorDeliveryItems only returns vendor delivery items', () => {
    expect(deliverySectionHelper.getVendorDeliveryItems(order1.lineItems)).toEqual(
      order1.lineItems.filter(item => item.deliveryType === 'O')
    )
  })

  test('getUPSDeliveryItems only returns ups delivery items', () => {
    expect(deliverySectionHelper.getUPSDeliveryItems(order1.lineItems)).toEqual(
      order1.lineItems.filter(item => item.deliveryType === 'U')
    )
  })

  test('getDeliveryDate returns delivery date data based on order.deliveryDate', () => {
    expect(deliverySectionHelper.getDeliveryDate(order1, mockDeliveryCalendar)).toEqual({
      date: '2019-06-04',
      readable: 'June 04',
    })
  })

  test('getDeliveryDate returns delivery date data based on order.deliveryDate and order.isPickup', () => {
    expect(deliverySectionHelper.getDeliveryDate({ ...order1, isPickup: true }, mockDeliveryCalendar)).toEqual({
      date: '2019-06-04',
      readable: 'June 04',
    })
  })

  test('getDeliveryDate returns delivery date data based no order deliveryDate', () => {
    expect(deliverySectionHelper.getDeliveryDate({ ...order1, deliveryDate: null }, mockDeliveryCalendar)).toEqual({
      date: '2019-06-04',
      readable: 'June 04',
    })
  })

  test('getDeliveryDate returns delivery date data based no order deliveryDate and pickup', () => {
    expect(
      deliverySectionHelper.getDeliveryDate({ ...order1, deliveryDate: null }, mockDeliveryCalendar, true)
    ).toEqual({ date: '2019-06-04', readable: 'June 04' })
  })

  test('getDeliveryDate returns delivery date data when no delivery calendar', () => {
    expect(deliverySectionHelper.getDeliveryDate(order1, [])).toEqual({
      date: new Date().toISOString().split('T')[0],
      readable: 'No delivery dates avaliable.',
    })
  })

  test('getDistributionCenterHours returns distirbution center hours based on order and date', () => {
    storeLocatorHelper.getStore = jest.fn(() => mockStore1)
    expect(deliverySectionHelper.getDistributionCenterHours(order1, { date: '2019-06-08' })).toEqual('10:00AM-9:00PM')
  })

  test('getDistributionDaysClosed returns distirbution center days closed based on order and date', () => {
    expect(deliverySectionHelper.getDistributionDaysClosed(order1)).toEqual('Sun, Mon, and Tue')
  })

  test('getDeliverySectionData returns correct data based on order delivery calendars', () => {
    expect(deliverySectionHelper.getDeliverySectionData(order1, mockDeliveryCalendar)).toEqual({
      fullDeliveryDate: 'Tuesday, June 04, 2019',
      isExpress: false,
      rtgDeliveryItems: [
        {
          category: 'livingroom',
          childItems: [],
          deliveryType: 'D',
          quantity: 2,
          sku: '26043633',
          title: 'Collins Point Brown Accent Chair2',
          unitPrice: 174,
        },
      ],
      upsDeliveryItems: [
        {
          category: 'livingroom',
          childItems: [],
          deliveryType: 'U',
          quantity: 2,
          sku: '26043634',
          title: 'Collins Point Brown Accent Chair3',
          unitPrice: 174,
        },
      ],
      uspsDeliveryItems: [
        {
          category: 'gift-card',
          childItems: [],
          deliveryType: 'T',
          quantity: 1,
          sku: '83333333',
          title: 'Gift Card',
          unitPrice: 100,
        },
      ],
      vendorDeliveryItems: [
        {
          category: 'livingroom',
          childItems: [],
          deliveryType: 'O',
          quantity: 2,
          sku: '26043632',
          title: 'Collins Point Brown Accent Chair',
          unitPrice: 174,
        },
      ],
    })
  })

  test('validateDeliveryStep returns no invalid fields when trying to switch to payment checkutStep', async () => {
    globalCheckoutHelper.getOrder = jest.fn(() => order1)
    checkoutService.updateDelivery = jest.fn(() => Promise.resolve({}))
    return deliverySectionHelper.validateDeliveryStep('payment').then(data => {
      expect(data).toEqual([])
    })
  })

  test('validateDeliveryStep does not allow user to skip to review checkutStep', async () => {
    globalCheckoutHelper.getOrder = jest.fn(() => order1)
    checkoutService.updateDelivery = jest.fn(() => Promise.resolve({}))
    return deliverySectionHelper.validateDeliveryStep('review').then(data => {
      expect(data).toEqual(['payment incomplete'])
    })
  })

  test('validateDeliveryStep does not allow user to move to next checkutStep when updateDelivery call fails', async () => {
    globalCheckoutHelper.getOrder = jest.fn(() => order1)
    checkoutService.updateDelivery = jest.fn(() => Promise.reject({}))
    return deliverySectionHelper.validateDeliveryStep('payment').then(data => {
      expect(data).toEqual(['buttonClick'])
    })
  })
})
