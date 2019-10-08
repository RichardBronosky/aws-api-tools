import reducer, { SET_IS_MOBILE, SET_IS_LANDSCAPE, SET_SHOW_SEARCH_RESULTS } from '../global'

const initialState = {
  isMobile: false,
  isLandscape: false,
  showSearchResults: false,
  plpGridWidth: null,
}

describe('global reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SET_IS_MOBILE when isMobile is true', () => {
    expect(
      reducer(initialState, {
        type: SET_IS_MOBILE,
        isMobile: true,
      })
    ).toEqual({
      isMobile: true,
      isLandscape: false,
      showSearchResults: false,
      plpGridWidth: null,
    })
  })

  it('should handle SET_IS_MOBILE when isMobile is false', () => {
    expect(
      reducer(initialState, {
        type: SET_IS_MOBILE,
        isMobile: false,
      })
    ).toEqual(initialState)
  })

  it('should handle SET_IS_LANDSCAPE when isMobile is true', () => {
    expect(
      reducer(initialState, {
        type: SET_IS_LANDSCAPE,
        isLandscape: true,
      })
    ).toEqual({
      isMobile: false,
      isLandscape: true,
      showSearchResults: false,
      plpGridWidth: null,
    })
  })

  it('should handle SET_IS_LANDSCAPE when isMobile is false', () => {
    expect(
      reducer(initialState, {
        type: SET_IS_LANDSCAPE,
        isLandscape: false,
      })
    ).toEqual(initialState)
  })

  it('should handle SET_SHOW_SEARCH_RESULTS when showSearchResults is true', () => {
    expect(
      reducer(initialState, {
        type: SET_SHOW_SEARCH_RESULTS,
        showSearchResults: true,
      })
    ).toEqual({
      isMobile: false,
      isLandscape: false,
      showSearchResults: true,
      plpGridWidth: null,
    })
  })

  it('should handle SET_SHOW_SEARCH_RESULTS when showSearchResults is false', () => {
    expect(
      reducer(initialState, {
        type: SET_SHOW_SEARCH_RESULTS,
        showSearchResults: false,
      })
    ).toEqual(initialState)
  })
})
