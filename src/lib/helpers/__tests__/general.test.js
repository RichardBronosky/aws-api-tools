import * as generalHelper from '../general'

describe('general helper', () => {
  test('getURL param returns a param value associated with the "page" key', () => {
    const fakeWindow = {
      location: { search: '?page=5' },
    }
    expect(generalHelper.getURLParam('page', fakeWindow)).toEqual('5')
  })

  test('getURL param returns null if no params are supplied', () => {
    const fakeWindow = {
      location: { search: null },
    }
    expect(generalHelper.getURLParam('page', fakeWindow)).toEqual(null)
  })
})
