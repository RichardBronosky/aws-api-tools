import React from 'react'
import { browserName, browserVersion, isMobile } from 'react-device-detect'
import { getFromBrowserStorage } from '../../lib/helpers/storage'
import BrowserDetect from './browser-detect'

export const browserData = {
  Chrome: {
    minVersion: 66,
    downloadLink: 'https://www.google.com/chrome/',
    logoUrl: 'https://www.google.com/chrome/static/images/chrome-logo.svg',
  },
  Safari: {
    minVersion: 9,
    downloadLink: 'https://support.apple.com/downloads/#safari',
    logoUrl: 'https://www.apple.com/v/safari/i/images/overview/safari_icon_large.png',
  },
  'Mobile Safari': {
    minVersion: 9,
  },
  Edge: {
    minVersion: 17,
    downloadLink: 'https://www.microsoft.com/en-us/windows/microsoft-edge',
    logoUrl: 'https://edgetipscdn.microsoft.com/site/images/favicon.595e8615.png',
  },
  IE: {
    minVersion: 11,
    downloadLink: 'https://windows.microsoft.com/en-us/internet-explorer/download-ie',
    logoUrl:
      'https://c.s-microsoft.com/en-us/CMSImages/ie_symbol_clr_56x56.png?version=73aa5bf1-0743-11e7-8f71-718675c983bf',
  },
  Firefox: {
    minVersion: 60,
    downloadLink: 'https://www.mozilla.org/en-US/firefox/',
    logoUrl: 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum-high-res.cfd87a8f62ae.png',
  },
}

export const browsers = ['Chrome', 'Firefox', 'Safari', 'Mobile Safari', 'IE', 'Edge']

export default class BrowserDetectWrapper extends React.PureComponent {
  state = {
    isOpen: false,
  }

  componentDidMount() {
    const unsupported = getFromBrowserStorage('session', 'unsupported_browser')
    if (!unsupported) {
      this.setState({
        isOpen: true,
      })
    }
  }

  closeModal = () => {
    this.setState({ isOpen: false })
    sessionStorage.setItem('unsupported_browser', true)
  }

  render() {
    return (
      <BrowserDetect
        isOpen={ this.state.isOpen }
        closeModal={ this.closeModal }
        browsers={ browsers }
        browserData={ browserData }
        browserName={ browserName }
        browserVersion={ browserVersion }
        isMobile={ isMobile }
      />
    )
  }
}
