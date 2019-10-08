import React from 'react'
import Helmet from 'react-helmet'
import SkipTo from '../../components/header/skip-to-navigation'
import Favicons from '../shared/favicons'
import InstantSearchRouter from '../shared/instant-search-router'
import BrowserDetect from '../browser-detect'
import LayoutChildren from './layout-children'
import '../../assets/css/global.sass'

export default ({ data, cartQuantity }) => (
  <div>
    <SkipTo />
    <BrowserDetect />
    <Helmet
      htmlAttributes={ { lang: 'en' } }
      meta={ [
        {
          name: 'description',
          content: 'Welcome to Rooms To Go!',
        },
        {
          name: 'google-site-verification',
          content: 'aHOTOMvUUGWQxbjXuOdF3co0LDA86iT0sjiylVwfrk4',
        },
        {
          name: 'google-site-verification',
          content: 'TGVtmWUFiuWkITFKGdw_cVZrhYlA-y3MIcMEhc-yDFw',
        },
        {
          name: 'google-site-verification',
          content: 'OWEZoxMRhdioV38iOk2ueJyCZSrsVUpUcho22mYuiRw',
        },
      ] }
      script={ [
        {
          type: 'text/javascript',
          innerHTML: 'window.dataLayer = window.dataLayer || [];',
        },
      ] }
      bodyAttributes={ {
        class: 'has-navbar-fixed-top',
      } }
    />
    <Favicons />
    <InstantSearchRouter { ...data }>
      <LayoutChildren data={ data } cartQuantity={ cartQuantity } />
    </InstantSearchRouter>
  </div>
)
