import React, { Component } from 'react'
import MobileNavList from './mobile-nav-list'
import arrowBack from '../../../assets/images/icons8-back-filled-24.png'

export default class SubNavigationMenu extends Component {
  render() {
    const { activeNavId, onNavLinkClick } = this.props
    return (
      <div className="header--mobile-subnavigation-container">
        { activeNavId !== '' && (
          <button
            tabIndex="0"
            className="back-menu"
            value="Go Back"
            aria-label="Go Back"
            onClick={ () => this.props.onBackButtonClick(activeNavId) }
          >
            <img className="arrowBack" aria-hidden="false" src={ arrowBack } />
            <span>Go Back</span>
          </button>
        ) }
        { this.props.navigationLinks.map(navLink => {
          let secondaryNavLinks = navLink.secondaryNavLinks
          let navLinkSections = navLink.navLinkSections
          let finalLinks = []
          if (navLinkSections) {
            navLinkSections.map(navLink => {
              if (navLink.links) {
                finalLinks.push(navLink)
                navLink.links.map(link => {
                  if (navLink.headingLink && navLink.headingLink.text !== link.text) finalLinks.push(link)
                })
              }
            })
          }
          if (secondaryNavLinks) {
            return (
              <MobileNavList
                key={ navLink.id }
                activeNavId={ activeNavId }
                navLinkId={ navLink.id }
                links={ secondaryNavLinks }
                onNavLinkClick={ onNavLinkClick.bind(this) }
              />
            )
          } else if (finalLinks) {
            return (
              <MobileNavList
                key={ navLink.id }
                activeNavId={ activeNavId }
                navLinkId={ navLink.id }
                links={ finalLinks }
                onNavLinkClick={ onNavLinkClick.bind(this) }
                final
              />
            )
          }
        }) }
      </div>
    )
  }
}
