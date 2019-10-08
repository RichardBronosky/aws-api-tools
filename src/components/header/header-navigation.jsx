import React, { Component } from 'react'
import NavigationLinkList from './navigation-link-lists'
import classNames from 'classnames'
import HoverIntent from 'react-hoverintent'
import RTGLink from '../shared/link'
import { isMobile as browserDetectMobile } from 'react-device-detect'
import { addToDataLayer } from '../../lib/helpers/google-tag-manager'
import { selectRegionBasedContent } from '../../lib/helpers/contentful'
import { getCurrentLocation } from '../../lib/helpers/geo-location'
import arrowForward from '../../assets/images/icons8-forward-24.png'
import Banner from '../shared/banner'
import { slugify } from '../../lib/helpers/string-helper'
import { taskDone } from '../../lib/helpers/aria-announce'
import * as Sentry from '@sentry/browser'

export default class HeaderNavigation extends Component {
  state = {
    activeNavId: '',
    activeSubNavId: '',
    navIsActive: false,
    subNavIsActive: false,
    mobileSubNavActive: false,
  }

  handleNavClick() {
    if (!browserDetectMobile) {
      this.setState({
        activeNavId: '',
        navIsActive: false,
      })
    }
  }

  handleNavOnMouseEnter(link) {
    this.setState(
      {
        activeNavId: link.id,
        navIsActive: true,
        subNavIsActive: true,
        activeSubNavId: link.secondaryNavLinks ? link.secondaryNavLinks[0].id : '',
      },
      () => this.props.setActivePopout('')
    )
  }

  handleNavOnMouseLeave(link) {
    this.setState({
      activeNavId: link.id,
      navIsActive: false,
      subNavIsActive: false,
    })
  }

  handleSubNavOnClick(link, navLink) {
    addToDataLayer(
      'click',
      'header',
      `${ navLink.displayText ? navLink.displayText : navLink.text }, click`,
      `${ link.primaryNavLink.displayText ? link.primaryNavLink.displayText : link.primaryNavLink.text }, ${
        link.primaryNavLink.slug
      }`
    )
    this.setState({ activeSubNavId: link.id, subNavIsActive: true })
  }

  handleSubNavOnMouseEnter(link) {
    this.setState({ activeSubNavId: link.id, subNavIsActive: true })
  }

  handleSubNavOnMouseLeave(link) {
    if (this.state.activeSubNavId !== link.id) this.setState({ activeSubNavId: link.id, subNavIsActive: false })
  }

  handleNavFocus(link, e, keyEvent) {
    if (keyEvent && this.state.subNavIsActive) {
      this.handleNavigationBlur(e)
      if (!link && keyEvent) {
        this.handleNavOnMouseEnter(link)
      } else {
        this.handleNavOnMouseEnter(this.currentFocus)
      }
    } else {
      if (
        e.relatedTarget &&
        e.relatedTarget.offsetParent &&
        e.relatedTarget.offsetParent.classList.contains('head--megamenu')
      ) {
        this.handleNavOnMouseEnter(link)
      } else {
        this.currentFocus = link
      }
    }
  }

  handleNavBlur(link) {
    if (!this.state.subNavIsActive) this.handleNavOnMouseLeave(link)
  }

  handleNavKeyDown(link, e) {
    const primaryLink = e.currentTarget
    const falselink = { id: '' }
    const toggleMenu = active => {
      e.preventDefault()
      if (active) {
        this.handleNavOnMouseLeave(falselink)
      } else {
        this.handleNavOnMouseEnter(link)
      }
    }

    if (!primaryLink) return

    // spacebar
    if (e.keyCode == 32) {
      toggleMenu(this.state.subNavIsActive)
    }

    switch (e.key) {
      case 'Enter':
        toggleMenu(this.state.subNavIsActive)
        break
      case 'Escape':
        this.handleNavOnMouseLeave(falselink)
        break
      case 'Tab':
        if (e.shiftKey) return
        break
      case 'ArrowRight':
        if (primaryLink.parentElement.nextSibling) {
          primaryLink.parentElement.nextElementSibling.firstChild.focus()
          this.handleNavFocus(link, e, true)
        }
        break
      case 'ArrowLeft':
        if (primaryLink.parentElement.previousSibling) {
          primaryLink.parentElement.previousElementSibling.firstChild.focus()
          this.handleNavFocus(link, e, true)
        }
        break
      case 'ArrowUp':
        break
      case 'ArrowDown':
        const currentActiveLink = e.currentTarget
        if (!currentActiveLink) return

        e.preventDefault()
        this.handleNavOnMouseEnter(link)
        const subNav = currentActiveLink.nextElementSibling

        if (!subNav) return
        taskDone(
          () => {
            const firstLink = subNav.querySelectorAll('a')[1]
            if (!firstLink) return
            firstLink.focus()
          },
          this.state.subNavIsActive ? 0 : 200,
          'focusFirstAnchor'
        )
        break
      default:
        break
    }
  }

  handleSubNavEscape(e) {
    const current = e.currentTarget

    if (!current) return
    const currentActiveLink = e.currentTarget.previousElementSibling
    const falselink = { id: '' }

    if (!currentActiveLink) return
    currentActiveLink.focus()
    this.handleNavOnMouseLeave(falselink)
  }

  handleNavigationBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      const falselink = { id: '' }
      this.handleNavOnMouseLeave(falselink)
    }
  }

  handleSubNavKeyDown(e) {
    const link = e.target
    const skipToHeadings = (next, lastInList) => {
      try {
        const parent = link.closest('.link-list')
        const sibling = next ? parent.nextSibling : parent.previousSibling
        const jumpToLink =
          sibling && sibling.classList.contains('link-list')
            ? lastInList
              ? sibling.lastChild.lastChild.firstChild
              : sibling.firstChild.firstChild.firstChild
            : false

        if (!jumpToLink) {
          let primaryLink = document.getElementById('primary-' + this.state.activeNavId)

          if (e.key == 'ArrowDown' && primaryLink.parentElement.nextSibling) {
            primaryLink.parentElement.nextSibling.firstChild.focus()
          } else {
            primaryLink.focus()
          }
        } else {
          jumpToLink.focus()
        }
      } catch (error) {
        Sentry.captureMessage(`MegaNav - Jump to Next/Prev Menu Fail: ${ error }`)
        return
      }
    }

    switch (e.key) {
      case 'Escape':
        this.handleSubNavEscape(e)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (link.parentElement.previousSibling) {
          link.parentElement.previousSibling.firstChild.focus()
        } else {
          skipToHeadings(false, true)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (link.parentElement.nextSibling) {
          link.parentElement.nextSibling.firstChild.focus()
        } else {
          skipToHeadings(true)
        }
        break
      case 'ArrowLeft':
        skipToHeadings()
        break
      case 'ArrowRight':
        skipToHeadings(true)
        break
      default:
        break
    }
  }

  handleTablistKeyDown(link, e) {
    const currentActiveTab = e.currentTarget
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
      case 'ArrowLeft':
        if (currentActiveTab.parentElement.previousSibling)
          currentActiveTab.parentElement.previousElementSibling.firstChild.focus()
        break
      case 'ArrowDown':
        e.preventDefault()
      case 'ArrowRight':
        if (currentActiveTab.parentElement.nextSibling)
          currentActiveTab.parentElement.nextElementSibling.firstChild.focus()
        break
      default:
        break
    }
  }

  render() {
    const data = this.props.data
    const location = getCurrentLocation()
    let header
    if (location && location.state && (location.state === 'North Carolina' || location.state === 'South Carolina')) {
      header = selectRegionBasedContent('FL', data)
    } else {
      header = selectRegionBasedContent(location.region, data)
    }

    return (
      <nav
        className="head--navigation active cell"
        id="head-navigation"
        role="navigation"
        aria-label="Primary"
        onBlur={ this.handleNavigationBlur.bind(this) }
        tabIndex="-1"
      >
        <ul>
          { header.map(navLink => (
            <HoverIntent
              key={ navLink.id }
              onMouseOver={ this.handleNavOnMouseEnter.bind(this, navLink) }
              onMouseOut={ this.handleNavOnMouseLeave.bind(this, navLink) }
              sensitivity={ 10 }
              interval={ 150 }
              timeout={ 100 }
            >
              <li
                className={ classNames('head--navigation-item', {
                  active: this.state.navIsActive && this.state.activeNavId === navLink.id,
                }) }
                onClick={ this.handleNavClick.bind(this, navLink) }
              >
                { !browserDetectMobile && (
                  <RTGLink
                    id={ `primary-${ navLink.id }` }
                    data={ navLink.primaryNavLink }
                    className={ classNames('desktop', slugify(navLink.primaryNavLink.text.toString().toLowerCase())) }
                    category="navigation"
                    action={ 'click' }
                    label={ navLink.primaryNavLink.displayText
                        ? navLink.primaryNavLink.displayText
                        : navLink.primaryNavLink.text }
                    onKey={ this.handleNavKeyDown.bind(this, navLink) }
                    onFocus={ this.handleNavFocus.bind(this, navLink) }
                    onBlur={ this.handleNavBlur.bind(this, navLink) }
                    noAriaLabel="true"
                    role="button"
                    aria-expanded={ this.state.navIsActive && this.state.activeNavId === navLink.id ? 'true' : 'false' }
                    aria-controls={ navLink.id }
                  />
                ) }
                { browserDetectMobile && (
                  <section
                    className={ classNames('desktop', slugify(navLink.primaryNavLink.text.toString().toLowerCase())) }
                    tabIndex="0"
                    aria-label={ navLink.primaryNavLink ? navLink.primaryNavLink.altDesc : null }
                  >
                    { navLink.primaryNavLink && navLink.primaryNavLink.displayText
                      ? navLink.primaryNavLink.displayText
                      : navLink.primaryNavLink.text }
                  </section>
                ) }
                <div
                  id={ navLink.id }
                  role="region"
                  aria-labelledby={ `primary-${ navLink.id }` }
                  aria-hidden={ this.state.activeNavId === navLink.id && this.state.navIsActive ? 'false' : 'true' }
                  aria-expanded={ this.state.activeNavId === navLink.id && this.state.navIsActive ? 'true' : 'false' }
                  className={ classNames('head--megamenu', {
                    active: this.state.activeNavId === navLink.id && this.state.navIsActive,
                  }) }
                  onKeyDownCapture={ this.handleSubNavKeyDown.bind(this) }
                >
                  <div className="head-wrapper">
                    { navLink.secondaryNavLinks != null && (
                      <div
                        className={ classNames('head--megamenu-left', {
                          active: true,
                        }) }
                      >
                        <ul role="tablist">
                          { navLink.secondaryNavLinks.map(secondaryNavLink => (
                            <li
                              key={ secondaryNavLink.id }
                              className={ classNames({
                                active: this.state.activeSubNavId === secondaryNavLink.id,
                              }) }
                              onMouseEnter={ this.handleSubNavOnMouseEnter.bind(this, secondaryNavLink) }
                              onFocus={ this.handleSubNavOnMouseEnter.bind(this, secondaryNavLink) }
                              onMouseLeave={ this.handleSubNavOnMouseLeave.bind(this, secondaryNavLink) }
                            >
                              <RTGLink
                                data={ secondaryNavLink.primaryNavLink }
                                className={ classNames({
                                  active: this.state.activeSubNavId === secondaryNavLink.id,
                                }) }
                                category="navigation"
                                action={ 'click' }
                                label={ secondaryNavLink.primaryNavLink.displayText
                                    ? secondaryNavLink.primaryNavLink.displayText
                                    : secondaryNavLink.primaryNavLink.text }
                                id={ secondaryNavLink.primaryNavLink.id ? secondaryNavLink.primaryNavLink.id : '' }
                                role="tab"
                                noAriaLabel="true"
                                tabIndex={ this.state.activeSubNavId === secondaryNavLink.id ? '0' : '-1' }
                                aria-selected={ this.state.activeSubNavId === secondaryNavLink.id ? 'true' : 'false' }
                                aria-controls={ secondaryNavLink.id }
                                onKey={ this.handleTablistKeyDown.bind(this, secondaryNavLink) }
                              >
                                { secondaryNavLink.primaryNavLink.displayText
                                  ? secondaryNavLink.primaryNavLink.displayText
                                  : secondaryNavLink.primaryNavLink.text }
                                <div
                                  className={ classNames('icon-container', {
                                    active: this.state.activeSubNavId === secondaryNavLink.id,
                                  }) }
                                >
                                  { this.state.activeSubNavId === secondaryNavLink.id && (
                                    <img
                                      className="arrowForward"
                                      aria-hidden="true"
                                      role="presentation"
                                      alt=""
                                      src={ arrowForward }
                                    />
                                  ) }
                                </div>
                              </RTGLink>
                            </li>
                          )) }
                        </ul>
                      </div>
                    ) }
                    { (navLink.secondaryNavLinks != null &&
                      navLink.secondaryNavLinks.map(secondaryNavLink => (
                        <div
                          key={ secondaryNavLink.id }
                          className={ classNames('head--megamenu-right', {
                            active:
                              this.state.activeSubNavId === secondaryNavLink.id ||
                              this.state.activeSubNavId === secondaryNavLink.id,
                          }) }
                        >
                          <NavigationLinkList data={ secondaryNavLink } />
                        </div>
                      ))) ||
                      (navLink.navLinkSections != null && (
                        <div
                          className={ classNames('head--megamenu-right', {
                            active: this.state.activeNavId === navLink.id || this.state.activeNavId === navLink.id,
                          }) }
                        >
                          <NavigationLinkList data={ navLink } />
                        </div>
                      )) }
                    { navLink.navBanner && (
                      <div className="head--megamenu-cat-specific">
                        <Banner data={ navLink.navBanner } placement="nav" />
                      </div>
                    ) }
                  </div>
                </div>
              </li>
            </HoverIntent>
          )) }
        </ul>
      </nav>
    )
  }
}
