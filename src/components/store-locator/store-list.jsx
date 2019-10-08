import React from 'react'
import RTGLink from '../shared/link'
import { expandState } from '../../lib/helpers/geo-location.js'
import { slugify } from '../../lib/helpers/string-helper'
import '../../assets/css/components/store-locator/store-list.sass'

export default class StoreList extends React.Component {
  render() {
    const { storeLocations: stores, states, abbrevStates } = this.props
    return (
      <div className="store-list">
        <h2>Store Listings by State</h2>
        <div className="state-list-container">
          { abbrevStates.map((state, index) => (
            <div key={ index } className="state-list">
              <h3>
                <RTGLink
                  data={ {
                    slug: `/stores/${ slugify(states[index]) }`,
                    category: 'store',
                    action: 'click',
                    label: `All stores in ${ states[index] }`,
                  } }
                >
                  { states[index] }
                </RTGLink>
              </h3>
              { stores
                .filter(loc => loc.state === state && loc.storeTypeId !== 'W')
                .map((loc, index) => {
                  let type
                  if (loc.storeTypeId === 'A') {
                    type = 'Showroom'
                  } else if (loc.storeTypeId === 'B') {
                    type = 'EXPRESS'
                  } else if (loc.storeTypeId === 'C') {
                    type = 'Outlet'
                  } else if (loc.storeTypeId === 'K') {
                    type = 'Kids'
                  } else if (loc.storeTypeId === 'P') {
                    type = 'Outdoor'
                  }
                  if (loc.storeName) {
                    return (
                      <div className="link-container" key={ loc.id }>
                        <RTGLink
                          data={ {
                            url: `/stores/${ slugify(expandState(state)).toLowerCase() }/${ slugify(
                              loc.city.toLowerCase()
                            ) }-${ slugify(loc.storeName.toLowerCase()) }-${
                              type ? slugify(type.toLowerCase()) : slugify(loc.storeType.toLowerCase())
                            }-${ loc.storeNumber }`,
                            text: `${ loc.city } - ${ loc.storeName } ${ type || loc.storeType }`,
                            category: 'store',
                            action: 'click',
                            label: `${ loc.city } - ${ loc.storeName } ${ type || loc.storeType }`,
                            value: index,
                          } }
                        />
                      </div>
                    )
                  } else {
                    return (
                      <div className="link-container" key={ loc.id }>
                        <RTGLink
                          data={ {
                            url: `/stores/${ slugify(expandState(state)).toLowerCase() }/${ slugify(
                              loc.city.toLowerCase()
                            ) }-${ type ? slugify(type.toLowerCase()) : slugify(loc.storeType.toLowerCase()) }-${
                              loc.storeNumber
                            }`,
                            text: `${ loc.city } ${ type || loc.storeType }`,
                            category: 'store',
                            action: 'click',
                            label: `${ loc.city } ${ type || loc.storeType }`,
                            value: index,
                          } }
                        />
                      </div>
                    )
                  }
                }) }
            </div>
          )) }
        </div>
      </div>
    )
  }
}
