import React from 'react'
import Helmet from 'react-helmet'
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react'
import Layout from '../components/layout'
import Breadcrumb from '../components/shared/breadcrumbs'
import RTGLink from '../components/shared/link'
import { decodeHtml, slugify, weekdays, months, getStandardTime } from '../lib/helpers/string-helper'
import { contentfulImage } from '../lib/helpers/contentful'
import { getStoreHours, getStoreName, getStoreInfoFromFeed } from '../lib/helpers/store-locator'
import { expandState } from '../lib/helpers/geo-location'
import { setupAnalytics } from '../lib/helpers/google-tag-manager'
import StoreInfo from '../components/store-locator/store-info'
import '../assets/css/pages/store-location.sass'

class Store extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedMarker: {},
  }

  componentDidMount() {
    const store = this.props.pageContext.store
    setupAnalytics({ pageData: { type: 'store', title: getStoreName(store), path: window.location.pathname } })
  }

  createCrumb = (crumb, slugPath) => {
    return {
      altDesc: `View All ${ crumb } Products`,
      id: slugPath,
      slug: slugPath,
      text: crumb,
    }
  }

  generateStoreCrumbs = store => {
    let crumbs = []
    crumbs.push(this.createCrumb('Find a Showroom', '/stores'))
    if (store.state) {
      crumbs.push(
        this.createCrumb(
          `Find a Showroom - ${ expandState(store.state) }`,
          `/stores/${ slugify(expandState(store.state)) }`
        )
      )
    }
    crumbs.push(
      this.createCrumb(
        decodeHtml(`${ store.city }, ${ store.state }${ store.storeName ? ` (${ store.storeName })` : '' }`),
        window.location.pathname
      )
    )
    return {
      crumbs: crumbs,
    }
  }

  onLocationClick = (props, marker) => {
    const store = this.props.pageContext.store
    const storeInfoFromFeed = getStoreInfoFromFeed(store.storeNumber)
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
      phone: storeInfoFromFeed.phone.replace('/', '-'),
      hours: getStoreHours(storeInfoFromFeed.store_hours),
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

  getTodayOpen = store => {
    const currentDay = weekdays[new Date().getDay()]
    const month = months[new Date().getMonth()].substr(0, 3)
    const day = new Date().getDate()
    const storeOpen = store.store_hours[`${ currentDay.toLowerCase() }Open`]
    const storeClose = store.store_hours[`${ currentDay.toLowerCase() }Closed`]
    if (storeOpen && storeClose) {
      return `${ currentDay }, ${ month } ${ day }: ${
        storeOpen ? `Open from ${ getStandardTime(storeOpen) } to ${ getStandardTime(storeClose) }` : 'Closed'
      }`
    } else {
      ;`${ currentDay }, ${ month } ${ day }`
    }
  }

  getHours = (store, day) => {
    const storeOpen = store.store_hours[`${ day.toLowerCase() }Open`]
    const storeClose = store.store_hours[`${ day.toLowerCase() }Closed`]
    if (storeOpen && storeClose) {
      return `${ getStandardTime(storeOpen) } - ${ getStandardTime(storeClose) }`
    }
  }

  render() {
    const { activeMarker, selectedMarker, showingInfoWindow } = this.state
    const store = this.props.pageContext.store
    const address = `${ store.address1 }${ store.address2 ? `, ${ store.address2 }` : '' }, ${ store.city }, ${ store.state } ${
      store.zip
    } `
    const storeInfoFromFeed = getStoreInfoFromFeed(store && store.storeNumber)
    if (store) {
      let storeTypeTitle = `${ store.city }, ${ store.state }`
      if (store.storeType === 'Showroom' || store.storeType === 'Express') {
        storeTypeTitle = storeTypeTitle + ' Furniture & Mattress Store'
      } else if (store.storeType === 'Kids') {
        storeTypeTitle = storeTypeTitle + ' Kids Furniture & Mattress Store'
      } else if (store.storeType === 'Outlet') {
        storeTypeTitle = storeTypeTitle + ' Affordable Furniture Outlet Store'
      } else if (store.storeType === 'Outdoor') {
        storeTypeTitle = storeTypeTitle + ' Patio Furniture: Wicker, Teak Outdoor Furniture Sets'
      }
      return (
        <Layout { ...this.props }>
          <Helmet title={ storeTypeTitle } />
          { store.seo && (
            <>
              { store.seo.pageTitle && <Helmet title={ store.seo.pageTitle } /> }
              { store.seo.canonical && (
                <Helmet
                  link={ [
                    {
                      rel: 'canonical',
                      href: store.seo.canonical,
                    },
                  ] }
                />
              ) }
              { store.seo.metaDescription && (
                <Helmet
                  meta={ [
                    {
                      name: 'description',
                      content: store.seo.metaDescription.metaDescription,
                    },
                  ] }
                />
              ) }
              { store.seo.metaRobots && (
                <Helmet
                  meta={ [
                    {
                      name: 'robots',
                      content: store.seo.metaRobots,
                    },
                  ] }
                />
              ) }
              { store.seo.jsonLdSchema && (
                <Helmet
                  script={ [
                    {
                      type: 'application/ld+json',
                      innerHTML: store.seo.jsonLdSchema.jsonLdSchema,
                    },
                  ] }
                />
              ) }
            </>
          ) }
          <section className="seo-page-heading full-width hide show">
            <div className="grid-container ">
              <div className="grid-x grid-margin-x">
                <div className="cell small-12">
                  <h1>
                    { store.seo && store.seo.pageHeading
                      ? store.seo.pageHeading
                      : `${ storeTypeTitle }${ store.storeName ? ` (${ store.storeName })` : '' }` }
                  </h1>
                </div>
              </div>
            </div>
          </section>
          <div className="stores-breadcrumb">
            <Breadcrumb data={ this.generateStoreCrumbs(store) } includeHeading={ true } />
          </div>
          <div className="store-location">
            <div className="loc-info">
              { address }
              <RTGLink
                data={ {
                  url: `tel:${ storeInfoFromFeed.phone.replace('/', '-') }`,
                  title: 'Call store',
                  category: 'store page',
                  action: 'Call click',
                  label: 'Call',
                } }
                className="phone-link"
              >
                { storeInfoFromFeed.phone.replace('/', '-') }
              </RTGLink>
              <span className="today">{ this.getTodayOpen(storeInfoFromFeed) }</span>
            </div>
            <div className="grid-x map-container">
              <Map
                initialCenter={ { lat: store.location.lat, lng: store.location.lon } }
                center={ { lat: store.location.lat, lng: store.location.lon } }
                className="map"
                google={ this.props.google }
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
              { store.storeImage && (
                <div className="store-image-container">
                  <img className="store-image" alt={ storeTypeTitle } src={ contentfulImage(store.storeImage.file.url) } />
                </div>
              ) }
              { storeInfoFromFeed.store_hours && (
                <div className="section-container">
                  <h2 className="section-heading">Store Hours:</h2>
                  { weekdays.map(day => (
                    <div className="hour" key={ day }>
                      { storeInfoFromFeed.store_hours[`${ day.toLowerCase() }Open`] && (
                        <>
                          <span className="day">{ day }</span>
                          <span className="time">{ this.getHours(storeInfoFromFeed, day) }</span>
                        </>
                      ) }
                      { !storeInfoFromFeed.store_hours[`${ day.toLowerCase() }Open`] && (
                        <>
                          <span className="day">{ day }</span>
                          <span className="time">Closed</span>
                        </>
                      ) }
                    </div>
                  )) }
                  { store.specialClosings && (
                    <span
                      className="special-closings"
                      dangerouslySetInnerHTML={ { __html: store.specialClosings.markdown.childMarkdownRemark.html } }
                    />
                  ) }
                </div>
              ) }
              { store.directions && (
                <div className="section-container">
                  <h2 className="section-heading">Store Location / Address:</h2>
                  <span>{ address }</span>
                  <br />
                  <span
                    className="directions"
                    dangerouslySetInnerHTML={ { __html: store.directions.childMarkdownRemark.html } }
                  />
                </div>
              ) }
              { store.neighborhoodsNearby && store.neighborhoodsNearby.length > 0 && (
                <div className="section-container">
                  <h2 className="section-heading">Neighborhoods Nearby:</h2>
                  <ul>
                    { store.neighborhoodsNearby.map((hood, index) => (
                      <li key={ index } className="hood">
                        { hood }
                      </li>
                    )) }
                  </ul>
                </div>
              ) }
              { store.description && (
                <div className="section-container fullwidth">
                  <h2 className="section-heading">Store Description:</h2>
                  <span
                    className="description"
                    dangerouslySetInnerHTML={ { __html: store.description.childMarkdownRemark.html } }
                  />
                </div>
              ) }
              { store.faqs && (
                <div className="section-container fullwidth">
                  <h2 className="section-heading">FAQs:</h2>
                  <span
                    className="faqs"
                    dangerouslySetInnerHTML={ { __html: store.faqs.markdown.childMarkdownRemark.html } }
                  />
                </div>
              ) }
            </div>
          </div>
        </Layout>
      )
    } else {
      return null
    }
  }
}

export default GoogleApiWrapper({
  apiKey: `${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`,
})(Store)
