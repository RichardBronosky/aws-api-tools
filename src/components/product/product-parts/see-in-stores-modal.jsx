import React from 'react'
import Modal from 'react-modal'
import Cookies from 'universal-cookie'
import { getSeeInStore } from '../../../lib/services/product'
import { validateZip, letters, weekdays } from '../../../lib/helpers/string-helper'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import '../../../assets/css/components/product/product-parts/see-in-stores-modal.sass'
import StoreInfo from '../../store-locator/store-info'
import StoreSearchBar from '../../store-locator/search-bar'
import MapLocationsList from '../../store-locator/map-locations-list'

const cookies = new Cookies()

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export class SeeInStoresModal extends React.Component {
  state = {
    markerconfigs: [],
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    zipInput: '',
    markerObjects: [],
    showHours: [],
    zip: cookies.get('rtg_zip'),
    currentDay: '',
    tomorrowDay: '',
    invalidZip: false,
    submittedZip: '',
    available: true,
  }

  componentDidMount() {
    this.setMapMarkers()
    const d = new Date()
    let t = new Date()
    t.setDate(d.getDate() + 1)
    this.setState({
      currentDay: weekdays[d.getDay()],
      tomorrowDay: weekdays[t.getDay()],
    })
  }

  getInitialCenter() {
    const { storeLat, storeLng } = this.props
    let lat, lng
    if (storeLat && storeLng) {
      lat = storeLat
      lng = storeLng
    } else if (this.state.markerconfigs.length) {
      lat = this.state.markerconfigs[0].lat
      lng = this.state.markerconfigs[0].lng
    } else {
      const rtg_location = cookies.get('rtg_location')
      lat = rtg_location.lat
      lng = rtg_location.long
    }

    return {
      lat: lat,
      lng: lng,
    }
  }

  setMapMarkers() {
    let zip =
      this.state.zip ||
      this.props.zip ||
      cookies.get('rtg_zip') ||
      (cookies.get('rtg_location') ? cookies.get('rtg_location').zip : null)
    const sku = this.props.product ? this.props.product.sku : null
    if (sku && typeof sku !== 'undefined' && zip !== '' && typeof zip !== 'undefined') {
      let markers = []
      getSeeInStore(sku, zip)
        .then(data => {
          if (data && data.length) {
            data.map(addr => {
              const config = {
                title: addr.address1,
                name: addr.storeName,
                lat: addr.latitude,
                lng: addr.longitude,
                city: addr.city,
                state: addr.state,
                storeNumber: addr.storeNumber,
                zip: addr.zipcode,
                phoneNumber: addr.phoneNumber,
                hours: addr.hours,
              }
              markers.push(config)
            })
            this.setState({
              markerconfigs: markers,
            })
          } else {
            this.setState({
              markerconfigs: [],
            })
          }
        })
        .catch(() =>
          this.setState({
            available: false,
          })
        )
    }
  }

  onMarkerMounted = element => {
    if (element && element.marker) {
      this.setState(prevState => {
        return {
          markerObjects: [...prevState.markerObjects, () => element.marker],
        }
      })
    }
  }

  onLocationClick = i => {
    this.setState({
      selectedPlace: this.state.markerconfigs[i],
      activeMarker: this.state.markerObjects[i](),
      showingInfoWindow: true,
    })
  }

  onMarkerClick = (props, marker) => {
    this.setState({
      selectedPlace: props,
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

  initMap = () => {
    return (
      <Map
        google={ this.props.google }
        initialCenter={ this.getInitialCenter() }
        center={ this.getInitialCenter() }
        zoom={ 8 }
        onClick={ this.onMapClicked }
      >
        { this.state.markerconfigs.map((config, i) => (
          <Marker
            ref={ this.onMarkerMounted }
            title={ config.title }
            id={ `marker-${ i }` }
            key={ i }
            name={ config.name }
            phoneNumber={ config.phoneNumber }
            city={ config.city }
            state={ config.state }
            storeNumber={ config.storeNumber }
            zip={ config.zip }
            position={ { lat: config.lat, lng: config.lng } }
            hours={ config.hours }
            onClick={ this.onMarkerClick }
            icon={ {
              url: `http://maps.google.com/mapfiles/marker${ letters[i] }.png`,
            } }
          />
        )) }
        <InfoWindow marker={ this.state.activeMarker } visible={ this.state.showingInfoWindow }>
          <StoreInfo selectedMarker={ this.state.selectedPlace } />
        </InfoWindow>
      </Map>
    )
  }

  getLocations() {
    const { markerconfigs, submittedZip, available, showHours, currentDay, tomorrowDay } = this.state
    if (!markerconfigs || !markerconfigs.length || !available)
      return (
        <div>
          { submittedZip && !available && (
            <p className="message">
              We apologize, but this product is not available at any locations near { submittedZip }.
            </p>
          ) }
          { !submittedZip && available && <p className="message">Loading...</p> }
          { !submittedZip && !available && (
            <p className="message">We apologize, but this product is unavailable in your region.</p>
          ) }
        </div>
      )
    return (
      <MapLocationsList
        markers={ markerconfigs }
        onLocationClick={ this.onLocationClick }
        showHours={ showHours }
        toggleShowHours={ this.toggleShowHours }
        currentDay={ currentDay }
        tomorrowDay={ tomorrowDay }
        lia={ this.props.lia }
      />
    )
  }

  toggleShowHours = i => {
    let allShowHours = this.state.showHours
    allShowHours[i] = !this.state.showHours[i]
    this.setState({
      showHours: allShowHours,
    })
  }

  updateInputZipValue = evt => {
    this.setState({
      zipInput: evt.target.value,
      zip: evt.target.value,
      invalidZip: false,
    })
  }

  changeZip = () => {
    if (validateZip(this.state.zipInput)) {
      this.setMapMarkers()
      this.initMap()
      this.render()
    } else {
      this.setState({
        invalidZip: true,
      })
    }
    this.setState({
      submittedZip: this.state.zipInput,
      available: true,
    })
  }

  render() {
    const { modalOpen, closeModal, product } = this.props

    if (!product || typeof product === 'undefined' || !product.sku || typeof product.sku === 'undefined') return null
    return (
      <Modal
        isOpen={ modalOpen }
        onRequestClose={ closeModal }
        contentLabel="See In Stores Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content see-in-store-modal">
          <div className="card grid-x">
            <div className="leftScroll">
              <h1 className="title">{ product ? product.title : '' }</h1>
              <img src={ product ? `${ product.primary_image }&w=250` : '' } alt={ product ? product.title : '' } />
              <StoreSearchBar
                title="Search For Locations"
                invalidZip={ this.state.invalidZip }
                zipInput={ this.state.zipInput }
                updateInputZipValue={ this.updateInputZipValue }
                changeZip={ this.changeZip }
              />
              <h2 className="heading">Available To See At The Following Showrooms</h2>
              { modalOpen && this.getLocations() }
            </div>
            { this.state.markerconfigs && this.state.markerconfigs.length > 0 && this.state.available && (
              <div className="map">
                <div className="mapHolder" id="mapHolder">
                  { modalOpen && this.initMap() }
                </div>
              </div>
            ) }
          </div>
          <button className="close-modal" tabIndex="0" value="Close" aria-label="Close" onClick={ closeModal }>
            <img
              className="icon close"
              alt="close icon"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
            />
          </button>
        </div>
      </Modal>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: `${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`,
})(SeeInStoresModal)
