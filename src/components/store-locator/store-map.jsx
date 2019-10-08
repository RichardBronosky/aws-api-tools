import React from 'react'
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react'
import { expandState, getLatLng, getCurrentLocation } from '../../lib/helpers/geo-location.js'
import { letters, weekdays, validateZip } from '../../lib/helpers/string-helper.js'
import StoreInfo from './store-info'
import StoreSearchBar from './search-bar'
import MapLocationsList from './map-locations-list'
import { getMarkers } from '../../lib/helpers/store-locator.js'
import '../../assets/css/components/store-locator/store-map.sass'

export class StoreMap extends React.Component {
  state = {
    currentLat: 0,
    currentLng: 0,
    invalidZip: false,
    zipInput: '',
    showHours: [],
    currentDay: '',
    tomorrowDay: '',
    loaded: false,
    activeMarker: {},
    markerObjects: [],
    selectedMarker: {},
    showingInfoWindow: false,
  }

  componentDidMount() {
    const d = new Date()
    let t = new Date()
    t.setDate(d.getDate() + 1)
    this.getInitialCenter(d, t, true)
    this.getInitialCenter(d, t)
  }

  getInitialCenter = (d, t, ip = false) => {
    const location = window.navigator && window.navigator.geolocation
    if (location && !ip) {
      location.getCurrentPosition(
        position => {
          this.setState({
            currentLat: position.coords.latitude,
            currentLng: position.coords.longitude,
            currentDay: weekdays[d.getDay()],
            tomorrowDay: weekdays[t.getDay()],
            loaded: true,
          })
        },
        error => {
          this.updateIPCenter(d, t)
        }
      )
    } else {
      this.updateIPCenter(d, t)
    }
  }

  updateIPCenter = (d, t) => {
    const rtg_location = getCurrentLocation()
    if (rtg_location) {
      this.setState({
        currentLat: rtg_location.lat,
        currentLng: rtg_location.long,
        currentDay: weekdays[d.getDay()],
        tomorrowDay: weekdays[t.getDay()],
        loaded: true,
      })
    }
  }

  updateInputZipValue = evt => {
    this.setState({
      zipInput: evt.target.value,
      invalidZip: false,
    })
  }

  changeZip = async () => {
    if (validateZip(this.state.zipInput)) {
      const location = await getLatLng(this.state.zipInput)
      if (location.lat) {
        this.setState({
          currentLat: location.lat,
          currentLng: location.lng,
        })
      } else {
        this.setState({
          invalidZip: true,
        })
      }
    } else {
      this.setState({
        invalidZip: true,
      })
    }
  }

  toggleShowHours = index => {
    let allShowHours = this.state.showHours
    allShowHours[index] = !this.state.showHours[index]
    this.setState({
      showHours: allShowHours,
    })
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

  onLocationClick = (index, marker) => {
    const i = parseInt(index)
    if (i > -1 && typeof this.state.markerObjects[index] === 'function') {
      this.setState({
        activeMarker: this.state.markerObjects[index](),
        selectedMarker: marker,
        showingInfoWindow: true,
      })
    }
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
    const { storeLocations } = this.props
    const {
      currentLat,
      currentLng,
      currentDay,
      tomorrowDay,
      showHours,
      activeMarker,
      selectedMarker,
      showingInfoWindow,
      loaded,
      invalidZip,
      zipInput,
    } = this.state
    let abbrevStates = [],
      states = []
    for (let i = 0, n = storeLocations.length; i < n; i++) {
      if (!abbrevStates.includes(storeLocations[i].state)) {
        abbrevStates.push(storeLocations[i].state)
      }
    }
    abbrevStates.sort()
    for (let i = 0, n = abbrevStates.length; i < n; i++) {
      states.push(expandState(abbrevStates[i]))
    }
    const markers = getMarkers(currentLat, currentLng, storeLocations)
    return (
      <div className="store-map grid-x">
        <h2 className="small-12">Store Map</h2>
        <div className="leftScroll">
          <StoreSearchBar
            title="Search For Locations"
            invalidZip={ invalidZip }
            zipInput={ zipInput }
            updateInputZipValue={ this.updateInputZipValue }
            changeZip={ this.changeZip }
          />
          <MapLocationsList
            markers={ markers }
            onLocationClick={ this.onLocationClick }
            showHours={ showHours }
            toggleShowHours={ this.toggleShowHours }
            currentDay={ currentDay }
            tomorrowDay={ tomorrowDay }
          />
        </div>
        { loaded && (
          <Map
            initialCenter={ { lat: currentLat, lng: currentLng } }
            center={ { lat: currentLat, lng: currentLng } }
            className="map"
            google={ this.props.google }
            zoom={ 11 }
            onClick={ this.onMapClicked }
          >
            <Marker
              position={ { lat: currentLat, lng: currentLng } }
              title="Current Location"
              name="Current Location"
              icon={ {
                url: 'http://maps.google.com/mapfiles/marker.png',
              } }
            />
            { markers.map((mark, index) => (
              <Marker
                ref={ this.onMarkerMounted }
                position={ { lat: mark.lat, lng: mark.lng } }
                title={ mark.name }
                icon={ {
                  url: `http://maps.google.com/mapfiles/marker${ letters[index] }.png`,
                } }
                key={ index }
                onClick={ () => this.onLocationClick(index, mark) }
              />
            )) }
            <InfoWindow marker={ activeMarker } visible={ showingInfoWindow }>
              <StoreInfo selectedMarker={ selectedMarker } />
            </InfoWindow>
          </Map>
        ) }
        { !loaded && (
          <div className="map">
            <p className="loading">Loading...</p>
          </div>
        ) }
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: `${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`,
})(StoreMap)
