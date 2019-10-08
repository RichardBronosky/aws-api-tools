import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../../../redux/store'
import DistributionCenterPopup from '../distribution-center-popup'
import { mockWarehouse1 } from '../../../../../../lib/mocks/storeDataMocks'

describe('DistributionCenterPopup', () => {
  it('renders correctly when popup is open', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DistributionCenterPopup store={ mockWarehouse1 } open />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when popup is closed', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DistributionCenterPopup store={ mockWarehouse1 } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
