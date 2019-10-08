import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { connect } from 'react-redux'
import { setIsMobile, setIsLandscape } from '../../redux/modules/global'
import HeaderMenu from './header-menu'
import SearchForm from '../shared/search-form'
import HeaderNavigation from './header-navigation'
import HeaderNavigationMobile from './mobile-navigation/header-navigation'
import { isMobileOnly as browserDetectMobileOnly } from 'react-device-detect'
import '../../assets/css/global/header.sass'
import ShadowBox from './shadow-box'

class Header extends React.Component {
  state = {
    activePopout: '',
    navIsActive: false,
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    const { isMobile, onSetIsMobile, isLandscape, onSetIsLandscape } = this.props
    if (window.innerWidth <= 1024 && !isMobile) {
      onSetIsMobile(true)
    } else if (window.innerWidth > 1024 && isMobile) {
      onSetIsMobile(false)
    }
    if (
      window.innerWidth <= 850 &&
      window.innerWidth >= 374 &&
      window.devicePixelRatio >= 2 &&
      window.innerHeight < window.innerWidth &&
      !isLandscape
    ) {
      onSetIsLandscape(true)
    } else if (
      window.innerWidth <= 850 &&
      window.innerWidth >= 374 &&
      window.innerHeight >= window.innerWidth &&
      isLandscape
    ) {
      onSetIsLandscape(false)
    }
  }

  toggleNavigation = () => {
    this.setState({
      navIsActive: !this.state.navIsActive,
    })
  }

  setNavigationActive = navIsActive => {
    this.setState({
      navIsActive: navIsActive,
    })
  }

  setActivePopout = activePopout => {
    if (this.state.activePopout !== activePopout) {
      this.setState({ activePopout: activePopout })
    } else {
      this.setState({ activePopout: '' })
    }
  }

  render() {
    const { isMobile, checkout } = this.props
    return (
      <StaticQuery
        query={ graphql`
          query Headers {
            contentfulHeader(contentful_id: { eq: "1OPMjU34rKse0aiu2csYgc" }) {
              id
              navigationLinks {
                ...HeaderNavLink
              }
              contentDefault: content {
                ...HeaderNavLink
              }
              contentSe {
                ...HeaderNavLink
              }
              contentTx {
                ...HeaderNavLink
              }
              contentFl {
                ...HeaderNavLink
              }
              contentOom {
                ...HeaderNavLink
              }
            }
          }
        ` }
        render={ data => (
          <header className="head grid-x">
            { browserDetectMobileOnly && <ShadowBox /> }

            <HeaderMenu
              toggleNavigation={ this.toggleNavigation }
              navIsActive={ this.state.navIsActive }
              activePopout={ this.state.activePopout }
              setActivePopout={ this.setActivePopout }
              isMobile={ isMobile }
              checkout={ checkout }
            />
            { !isMobile && !checkout && (
              <HeaderNavigation
                key={ data.contentfulHeader.id }
                data={ data.contentfulHeader }
                setActivePopout={ this.setActivePopout }
              />
            ) }
            { isMobile && !checkout && (
              <div className="small-12 cell" key={ data.contentfulHeader.id }>
                <div
                  ref={ searchNode => {
                    this.searchNode = searchNode
                  } }
                >
                  <SearchForm
                    id="search-mobile cell"
                    addClasses={ {
                      active: !this.state.navIsActive && this.state.activePopout === '',
                      searchmobile: true,
                    } }
                  />
                </div>
                <HeaderNavigationMobile
                  data={ data.contentfulHeader }
                  navIsActive={ this.state.navIsActive }
                  setNavigationActive={ this.setNavigationActive }
                />
              </div>
            ) }
          </header>
        ) }
      />
    )
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetIsMobile: isMobile => dispatch(setIsMobile(isMobile)),
    onSetIsLandscape: isLandscape => dispatch(setIsLandscape(isLandscape)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export const HeaderNavLinkFragment = graphql`
  fragment HeaderNavLink on ContentfulHeaderNavLinks {
    id
    primaryNavLink {
      ...Link
    }
    navLinkSections {
      id
      links {
        ...Link
      }
      headingLink {
        ...Link
      }
    }
    navBanner {
      ...Banner
    }
    contentful_id
    __typename
  }
`
