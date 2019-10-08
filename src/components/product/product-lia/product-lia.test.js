import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import ProductLIA from './product-lia'
import { mockProduct1 } from '../../../lib/mocks/productDataMocks'
import { mockStore1 } from '../../../lib/mocks/storeDataMocks'
import { mockLocation1 } from '../../../lib/mocks/locationDataMocks'

describe('ProductLIA', () => {
  it('renders correctly if product is available in store', async () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ProductLIA
            product={ mockProduct1 }
            store={ mockStore1 }
            region={ mockLocation1.region }
            region={ mockLocation1.zone }
            available
          />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly if product is not available in store', async () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ProductLIA
            product={ mockProduct1 }
            store={ mockStore1 }
            region={ mockLocation1.region }
            region={ mockLocation1.zone }
          />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
