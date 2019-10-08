import * as productHelper from '../product'
import * as productServices from '@services/product'
import giftCardImage from '@assets/images/gift-cards.jpg'

describe('product helper', () => {
  const giftCardProduct = {
    sku: '83333333',
    delivery_type: 'T',
    price: 100,
    unitPrice: 100,
    title: 'Gift Card',
    primary_image: giftCardImage,
    grid_image: giftCardImage,
    category: 'gift-card',
    catalog: 'gift-card',
    pricing: { default_price: 100 },
  }
  test('getGiftCardProductData returns correct data', () => {
    expect(productHelper.getGiftCardProductData()).toEqual(giftCardProduct)
  })

  const giftCardPromise = new Promise(resolve => resolve(giftCardProduct))

  test('fetchProductOrGC returns the correct giftCardData', () => {
    expect(productHelper.fetchProductOrGC('83333333')).toEqual(giftCardPromise)
  })

  test('fetchProductOrGC calls fetchProductBySKU', () => {
    const fetchProductBySkuSpy = jest.spyOn(productServices, 'fetchProductBySku')
    productHelper.fetchProductOrGC('23122360')
    expect(fetchProductBySkuSpy).toHaveBeenCalled()
  })
})
