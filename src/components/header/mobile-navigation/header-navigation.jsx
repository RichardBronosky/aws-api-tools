import React, { Component } from 'react'
import { navigate } from 'gatsby'
import classNames from 'classnames'
import SubNavigationMenu from './subnavigation-menu'
import MenuLowerLinks from './menu-lower-links'
import MenuUpperLinks from './menu-upper-links'
import { selectRegionBasedContent } from '../../../lib/helpers/contentful'
import { getCurrentLocation, getRegionZone } from '../../../lib/helpers/geo-location'
import arrowForward from '../../../assets/images/icons8-forward-24.png'

export default class HeaderNavigationMobile extends Component {
  state = {
    activeNavId: '',
    navTree: [this.props.data.navigationLinks],
    mobileSubNavActive: false,
    subNavLinks: this.props.data.navigationLinks,
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navIsActive !== this.props.navIsActive && !this.props.navIsActive) {
      this.resetState()
    }
  }

  resetState() {
    this.setState({
      activeNavId: '',
      navTree: [this.props.data.navigationLinks],
      mobileSubNavActive: false,
      subNavLinks: this.props.data.navigationLinks,
    })
  }

  handleClickOutside = event => {
    if (
      this.node &&
      !this.node.contains(event.target) &&
      (!event.target.attributes['aria-label'] || event.target.attributes['aria-label'] !== 'Content') &&
      (!event.target.className || event.target.className !== 'banner-mobile-image')
    ) {
      this.resetState()
      this.props.setNavigationActive(false)
    }
  }

  handleNavClick = (link, prevLinks) => {
    if (link.text) {
      this.resetState()
      this.props.setNavigationActive(false)
      navigate(link.slug || (link.internalURL && link.internalUrl.url))
    } else {
      let newNavTree = this.state.navTree
      newNavTree.push(link)
      this.setState({
        activeNavId: link.id,
        mobileSubNavActive: true,
        navTree: newNavTree,
        subNavLinks: prevLinks,
      })
    }
  }

  onBackButtonClick = () => {
    let newNavTree = this.state.navTree
    newNavTree.pop()
    if (newNavTree.length > 1) {
      let activeNavIndexId = newNavTree[newNavTree.length - 1].id
      let lastLinks = newNavTree[newNavTree.length - 2]
      if (lastLinks.secondaryNavLinks) {
        this.setState({
          activeNavId: activeNavIndexId,
          navTree: newNavTree,
          subNavLinks: lastLinks.secondaryNavLinks,
        })
      } else {
        this.setState({
          activeNavId: activeNavIndexId,
          navTree: newNavTree,
          subNavLinks: lastLinks,
        })
      }
    } else {
      this.resetState()
    }
  }

  render() {
    const { data, navIsActive } = this.props
    const location = getCurrentLocation()
    let header = selectRegionBasedContent(getRegionZone().region, data)
    if (location && location.state && (location.state === 'North Carolina' || location.state === 'South Carolina')) {
      header = selectRegionBasedContent('FL', data)
    }
    return (
      <nav
        ref={ node => {
          this.node = node
        } }
        className={ classNames('head--navigation', {
          active: navIsActive,
        }) }
        id="head-navigation"
      >
        <MenuUpperLinks mobileSubNavActive={ this.state.mobileSubNavActive } />
        <ul>
          { header.map(navLink => (
            <li
              key={ navLink.id }
              className={ classNames('head--navigation-item', {
                active: navIsActive && this.state.activeNavId === navLink.id,
              }) }
            >
              <button
                className={ classNames('head--mobile-navigation-button', {
                  active: !this.state.mobileSubNavActive,
                }) }
                onClick={ this.handleNavClick.bind(this, navLink, header) }
                gtm-category="navigation"
                gtm-action={ navLink.primaryNavLink.displayText ? 'click' : 'link click' }
                gtm-label={ navLink.primaryNavLink.displayText ? navLink.primaryNavLink.displayText : navLink.primaryNavLink.text }
              >
                { navLink.primaryNavLink.displayText ? navLink.primaryNavLink.displayText : navLink.primaryNavLink.text }
                <img className="arrowForward" aria-hidden="true" role="presentation" alt="" src={ arrowForward } />
              </button>
            </li>
          )) }
        </ul>
        <SubNavigationMenu
          navigationLinks={ this.state.subNavLinks }
          activeNavId={ this.state.activeNavId }
          onNavLinkClick={ this.handleNavClick.bind(this) }
          onBackButtonClick={ this.onBackButtonClick.bind(this) }
        />
        <MenuLowerLinks mobileSubNavActive={ this.state.mobileSubNavActive } />
      </nav>
    )
  }
}
