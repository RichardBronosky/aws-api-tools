import React from 'react'
import Modal from 'react-modal'
import { CustomView } from 'react-device-detect'
import RTGLink from '../shared/link'
import '../../assets/css/browser-detect.sass'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export default ({ isOpen, closeModal, browsers, browserData, isMobile, browserName, browserVersion }) => {
  let browser_name = browserName
  if (browser_name === 'IE') {
    browser_name = 'Internet Explorer'
  }
  return (
    <div className="browser-detect">
      { browsers.map(browser => (
        <CustomView
          condition={ browserName === browser && parseFloat(browserVersion) < browserData[browser].minVersion && !isMobile }
          key={ browser }
        >
          <Modal
            isOpen={ isOpen }
            onRequestClose={ closeModal }
            contentLabel="Browser Unsupported Modal"
            className="browser-unsupported"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={ false }
            shouldCloseOnEsc={ false }
          >
            <div className="modal-content">
              <div className="grid-x">
                <img
                  className="browser-logo small-12"
                  alt={ `${ browser_name } Logo` }
                  src={ browserData[browser].logoUrl }
                />
                <div className="text-container small-12">
                  <span className="msg">
                    We notice you are running { `${ browser_name } ${ browserVersion }` }. Please be aware that this site
                    supports { `${ browser_name } ${ browserData[browser].minVersion.toFixed(1) }` }+ and may not run
                    correctly on your version.
                  </span>
                  <span className="msg">
                    If you would like to upgrade to the latest version of { browser_name } please click
                    <RTGLink
                      className="upgrade"
                      data={ {
                        url: browserData[browser].downloadLink,
                        title: `Download ${ browser_name }`,
                        category: 'unsupported-browser',
                        action: 'click',
                        label: `Download ${ browser_name }`,
                      } }
                    >
                      here
                    </RTGLink>
                    .
                  </span>
                </div>
                <button
                  className="blue-action-btn"
                  tabIndex="0"
                  value="Continue to Site"
                  aria-label="Continue to Site"
                  onClick={ closeModal }
                >
                  Continue to Site
                </button>
              </div>
            </div>
          </Modal>
        </CustomView>
      )) }
    </div>
  )
}
