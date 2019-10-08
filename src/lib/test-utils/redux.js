import configureMockStore from 'redux-mock-store'
import * as reduxStore from '../../redux/store'

const mockStore = configureMockStore([])

export const mockStoreDispatch = initialState => {
  reduxStore.store = mockStore(initialState)
  reduxStore.store.dispatch = jest.fn()
}
