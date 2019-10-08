import React from 'react'
import StoreMap from './store-map'
import StoreList from './store-list'
import '../../assets/css/components/store-locator/store-locator.sass'
import { setupAnalytics } from '../../lib/helpers/google-tag-manager.js'

export default class StoreLocator extends React.Component {
  componentDidMount() {
    setupAnalytics({ pageData: { type: 'store', title: 'Store Locator', path: '/stores' } })
  }

  render() {
    const { data } = this.props
    return (
      <div className="store-locator-page">
        <section className="seo-page-heading full-width hide show">
          <div className="grid-container ">
            <div className="grid-x grid-margin-x">
              <div className="cell small-12">
                <h1>Rooms To Go Store Locator</h1>
              </div>
            </div>
          </div>
        </section>
        <StoreMap storeLocations={ data.stores } />
        <StoreList storeLocations={ data.stores } states={ data.states } abbrevStates={ data.abbrevStates } />
      </div>
    )
  }
}
