import React from 'react'
import SimpleSlider from '../../shared/slider'
import RTGLink from '../../shared/link'
import classNames from 'classnames'
import '../../../assets/css/components/product/product-parts/product-upgrades.sass'
import { productPrice, productAvailability } from '../../../lib/helpers/product'
import { currencyFormatUS, slugify } from '../../../lib/helpers/string-helper'
import { analyticsProduct } from '../../../lib/helpers/google-tag-manager'
import { productUrl } from '../../../lib/helpers/route'

export default class ProductUpgrades extends React.Component {
  state = {
    availableUpgrades: [],
    currentUpgradeIndex: 0,
  }
  componentDidMount() {
    this.setupUpgrades()
  }
  setupUpgrades = () => {
    const { upgrades, productSku, filterAvailability } = this.props
    const filteredUpgrades = upgrades.filter(u => u.sku && u.title && u.pricing)
    let availableUpgrades =
      filteredUpgrades && filterAvailability
        ? filteredUpgrades.filter(u => productAvailability(u) || u.sku === productSku)
        : filteredUpgrades
    const currentUpgrade = availableUpgrades.filter(u => u.sku === productSku)[0]
    availableUpgrades = availableUpgrades.filter(u => u.sku !== productSku)
    if (currentUpgrade) {
      availableUpgrades.unshift(currentUpgrade)
    }
    this.setState({
      availableUpgrades: availableUpgrades,
    })
  }
  render() {
    const { heading, productSku, currentProductPrice, calculateDifference, labelPrefix, includeTitle } = this.props
    const { availableUpgrades } = this.state
    if (availableUpgrades && availableUpgrades.length > 0) {
      return (
        <div className="product-addons grid-x">
          <div className="addon-heading cell small-12">{ heading }</div>
          <div className="addons small-12 large-12">
            <SimpleSlider
              className={ classNames('small') }
              data={ {
                heading: '',
              } }
            >
              { availableUpgrades &&
                availableUpgrades.map((upgrade, index) => {
                  const upgradeLabelArr = upgrade.label && upgrade.label.split(',')
                  return (
                    <RTGLink
                      key={ `upgrade_${ heading }_${ upgrade.sku }` }
                      data={ {
                        url: productUrl(
                          upgrade.title ? slugify(upgrade.title).toLowerCase() : '',
                          upgrade.sku ? upgrade.sku.toLowerCase() : ''
                        ),
                        title: upgrade.sku,
                        category: 'product-upgrade',
                        action: 'upgrade click',
                        label: upgrade.sku,
                      } }
                      noTabIndex={ true }
                      className={ classNames('upgrade-link capitalize grid-x', { active: upgrade.sku === productSku }) }
                      trackingData={ {
                        event: 'ee_click',
                        ecommerce: {
                          click: {
                            list: `upgrade_${
                              heading
                                ? heading
                                    .toLowerCase()
                                    .split(' ')
                                    .join('_')
                                : ''
                            }`,
                            position: index + 1,
                            products: [analyticsProduct(upgrade, 1, index + 1)],
                          },
                        },
                      } }
                    >
                      <div
                        className={ classNames('upgrade-label small-12', {
                          'has-title': includeTitle,
                          'no-title': !includeTitle,
                        }) }
                      >
                        { includeTitle && <div className="upgradeTitle">{ upgrade.title }</div> }
                        <div className="grid-x included">
                          { includeTitle && <h4 className="small-6 includes-heading">Includes:</h4> }
                          <div className="upgrade-includes small-6">
                            { labelPrefix &&
                              upgradeLabelArr &&
                              upgradeLabelArr.map((upgradeLabel, index) => <p key={ index }>{ upgradeLabel }</p>) }
                            { !labelPrefix && upgrade.label }
                          </div>
                        </div>
                      </div>
                      <p className="upgrade-price small-12">
                        { (calculateDifference &&
                          (productPrice(upgrade) - currentProductPrice > 0 ? '+' : '') +
                            currencyFormatUS(productPrice(upgrade) - currentProductPrice)) ||
                          currencyFormatUS(productPrice(upgrade)) }
                      </p>
                      <i className="icon checkmark" />
                    </RTGLink>
                  )
                }) }
            </SimpleSlider>
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }
}
