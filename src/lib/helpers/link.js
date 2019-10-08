import { navigate as gatsbyNavigate } from 'gatsby'
import { store } from '../../redux/store'
import { setShowSearchResults } from '../../redux/modules/global'

export const navigate = slug => {
  if (store.getState().global.showSearchResults) {
    store.dispatch(setShowSearchResults(false))
  }
  gatsbyNavigate(slug)
}
