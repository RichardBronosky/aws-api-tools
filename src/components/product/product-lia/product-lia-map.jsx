import React from 'react'
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react'
import StoreInfo from '../../store-locator/store-info'
import { getStoreName, getStoreHours } from '../../../lib/helpers/store-locator'
import '../../../assets/css/components/product/product-lia/product-lia-map.sass'

class ProductLIAMap extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedMarker: {},
  }

  onLocationClick = (props, marker) => {
    const store = this.props.store
    let fullMarker = {
      ...props,
      title: store.address1,
      name: getStoreName(store),
      lat: store.location.lat,
      lng: store.location.lon,
      city: store.city,
      state: store.state,
      storeNumber: store.storeNumber,
      zip: store.zip,
      phone: store.phoneNumber,
      hours: getStoreHours(store.storeHours),
    }
    this.setState({
      selectedMarker: fullMarker,
      activeMarker: marker,
      showingInfoWindow: true,
    })
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      })
    }
  }

  render() {
    const { store, google } = this.props
    const { activeMarker, selectedMarker, showingInfoWindow } = this.state
    return (
      <Map
        initialCenter={ { lat: store.location.lat, lng: store.location.lon } }
        center={ { lat: store.location.lat, lng: store.location.lon } }
        className="product-lia-map"
        google={ google }
        zoom={ 11 }
        onClick={ this.onMapClicked }
      >
        <Marker
          position={ { lat: store.location.lat, lng: store.location.lon } }
          title={ `${ store.city }${ store.storeName ? ` - ${ store.storeName }` : '' } ${ store.storeType }` }
          icon={ {
            url: `http://maps.google.com/mapfiles/markerA.png`,
          } }
          onClick={ this.onLocationClick }
        />
        <InfoWindow marker={ activeMarker } visible={ showingInfoWindow }>
          <StoreInfo selectedMarker={ selectedMarker } />
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: `${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`,
})(ProductLIAMap)
