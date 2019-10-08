import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import * as productHelper from '../../../lib/helpers/product'
import * as cartHelper from '../../../lib/helpers/cart'
import { mockProduct1, mockAddonItem, mockActiveAddon } from '../../../lib/mocks/productDataMocks'
import AddonSelection from '../cart-parts/add-on-selection'

describe('AddonSelection', () => {
  const testProps = {
    product: mockProduct1,
    activeAddons: null,
    cartIndex: 0,
    productQuantity: 1,
  }

  it('renders correctly without addons', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <AddonSelection { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with addon items, and without active addons', () => {
    const props = {
      ...testProps,
      product: { ...mockProduct1, addon_items: [mockAddonItem] },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <AddonSelection { ...props } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with addon items, and with active addons', () => {
    const props = {
      ...testProps,
      product: { ...mockProduct1, addon_items: [mockAddonItem] },
      activeAddons: [mockActiveAddon],
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <AddonSelection { ...props } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls isActiveAddon when simulating checkbox onChange when addon is not active', () => {
    const tree = renderer.create(<AddonSelection { ...testProps } />)
    productHelper.isActiveAddon = jest.fn()
    cartHelper.removeActiveAddon = jest.fn()
    tree.root.findByProps({ type: 'checkbox' }).props.onChange()
    expect(productHelper.isActiveAddon).toHaveBeenCalled()
    expect(cartHelper.removeActiveAddon).not.toHaveBeenCalled()
  })

  it('calls isActiveAddon when simulating checkbox onChange when addon is active', () => {
    const tree = renderer.create(<AddonSelection { ...{ ...testProps, activeAddons: [mockActiveAddon] } } />)
    productHelper.isActiveAddon = jest.fn()
    cartHelper.fetchAndAddActiveAddon = jest.fn()
    tree.root.findByProps({ type: 'checkbox' }).props.onChange()
    expect(productHelper.isActiveAddon).toHaveBeenCalled()
    expect(cartHelper.fetchAndAddActiveAddon).toHaveBeenCalled()
  })
})
