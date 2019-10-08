// Actions
export const SET_IS_MOBILE = 'SET_IS_MOBILE'
export const SET_IS_LANDSCAPE = 'SET_IS_LANDSCAPE'
export const SET_SHOW_SEARCH_RESULTS = 'SET_SHOW_SEARCH_RESULTS'
export const SET_PLP_GRID_WIDTH = 'SET_PLP_GRID_WIDTH'

// Action Creators
export function setIsMobile(isMobile) {
  return { type: SET_IS_MOBILE, isMobile }
}

export function setIsLandscape(isLandscape) {
  return { type: SET_IS_LANDSCAPE, isLandscape }
}

export function setShowSearchResults(showSearchResults) {
  return { type: SET_SHOW_SEARCH_RESULTS, showSearchResults }
}

export function setPlpGridWidth(plpGridWidth) {
  return { type: SET_PLP_GRID_WIDTH, plpGridWidth }
}

// Reducer
const initialState = {
  isMobile: false,
  isLandscape: false,
  showSearchResults: false,
  plpGridWidth: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_MOBILE:
      return {
        ...state,
        isMobile: action.isMobile,
      }
    case SET_IS_LANDSCAPE:
      return {
        ...state,
        isLandscape: action.isLandscape,
      }
    case SET_SHOW_SEARCH_RESULTS:
      return {
        ...state,
        showSearchResults: action.showSearchResults,
      }
    case SET_PLP_GRID_WIDTH:
      return {
        ...state,
        plpGridWidth: action.plpGridWidth,
      }
    default:
      return state
  }
}
