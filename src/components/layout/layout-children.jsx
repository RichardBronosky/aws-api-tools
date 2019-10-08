import React from 'react'
import classNames from 'classnames'
import Header from '../../components/header/header'
import Footer from '../../components/footer'
import SearchResults from '../search/search-results'
import QueryRuleCustomData from '../shared/query-rule-custom-data'
import RTGLink from '../shared/link'
import { attemptScrollToTop } from '../../lib/helpers/general'
import { isMobileOnly as browserDetectMobileOnly } from 'react-device-detect'
import { getFromBrowserStorage } from '@helpers/storage'
import '../../assets/css/global.sass'

export default ({ data, cartQuantity }) => {
  let shadowBox = getFromBrowserStorage('local', 'shadowBox')
  shadowBox = shadowBox === 'show' && browserDetectMobileOnly
  return (
    <>
      <Header checkout={ data.checkout } />
      { shadowBox && <span className="shadowBox" /> }
      <div id="content" role="main" aria-label="Content" tabIndex="-1" className="content-wrapper grid-container">
        { data.showSearchResults ? (
          <>
            <QueryRuleCustomData />
            <SearchResults
              displayFilters={ ['color_family', 'brand', 'category', 'material_family', 'style'] }
              matchPath={ data.pageContext
                  ? data.pageContext.matchPath
                    ? data.pageContext.matchPath.replace('*', '')
                    : '/search'
                  : '/search' }
              source={ 'search bar' }
            />
          </>
        ) : (
          data.children
        ) }
      </div>
      { !data.checkout && !data.cartPage && (
        <RTGLink
          data={ {
            slug: '/cart',
            title: 'View Full Cart',
            category: 'header',
            action: 'cart interaction mobile scroll',
            label: 'view full cart',
          } }
          className={ classNames('scrolled-cart', {
            'fade-in': data.scrolled,
            'fade-out': !data.scrolled && data.fadeOut,
          }) }
          aria-hidden={ !data.scrolled && data.fadeOut }
        >
          <img
            className="icon cart"
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23FFF%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctitle%3EAsset%201%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M34.48%2C78.83A10.59%2C10.59%2C0%2C1%2C0%2C45.07%2C89.41%2C10.59%2C10.59%2C0%2C0%2C0%2C34.48%2C78.83Zm0%2C16.17a5.59%2C5.59%2C0%2C1%2C1%2C5.59-5.59A5.6%2C5.6%2C0%2C0%2C1%2C34.48%2C95Z%22%2F%3E%3Cpath%20d%3D%22M78.45%2C78.83A10.59%2C10.59%2C0%2C1%2C0%2C89%2C89.41%2C10.59%2C10.59%2C0%2C0%2C0%2C78.45%2C78.83Zm0%2C16.17A5.59%2C5.59%2C0%2C1%2C1%2C84%2C89.41%2C5.6%2C5.6%2C0%2C0%2C1%2C78.45%2C95Z%22%2F%3E%3Cpath%20d%3D%22M100%2C19.7v0a2.58%2C2.58%2C0%2C0%2C0%2C0-.29%2C1.52%2C1.52%2C0%2C0%2C0%2C0-.21%2C1.83%2C1.83%2C0%2C0%2C0-.08-.25%2C1.87%2C1.87%2C0%2C0%2C0-.07-.22%2C2%2C2%2C0%2C0%2C0-.11-.2%2C1.55%2C1.55%2C0%2C0%2C0-.12-.22l-.16-.18a1.3%2C1.3%2C0%2C0%2C0-.15-.18l-.19-.16-.18-.14a2.25%2C2.25%2C0%2C0%2C0-.21-.12l-.23-.11a1.17%2C1.17%2C0%2C0%2C0-.2-.06L98%2C17.25h0l-.21%2C0-.22%2C0H18L14.86%2C2a2.49%2C2.49%2C0%2C0%2C0-2.45-2H2.5a2.5%2C2.5%2C0%2C0%2C0%2C0%2C5h7.87l3%2C14.55c0%2C.05%2C0%2C.1%2C0%2C.15a2.48%2C2.48%2C0%2C0%2C0%2C.28%2C1.12L21%2C56.71a2.83%2C2.83%2C0%2C0%2C0%2C.05.5l2.75%2C13.51a2.5%2C2.5%2C0%2C0%2C0%2C2.45%2C2H88.76a2.5%2C2.5%2C0%2C0%2C0%2C0-5H28.27L26.49%2C59h64.6a2.42%2C2.42%2C0%2C0%2C0%2C.47-.05l.16%2C0%2C.29-.09.17-.08a1.71%2C1.71%2C0%2C0%2C0%2C.23-.13l.17-.11.2-.17.13-.13a1.92%2C1.92%2C0%2C0%2C0%2C.18-.22%2C1%2C1%2C0%2C0%2C0%2C.11-.15l.13-.24.08-.17a2.76%2C2.76%2C0%2C0%2C0%2C.08-.27%2C1.05%2C1.05%2C0%2C0%2C0%2C.05-.19s0%2C0%2C0%2C0L100%2C20.13a1.64%2C1.64%2C0%2C0%2C0%2C0-.22A1.49%2C1.49%2C0%2C0%2C0%2C100%2C19.7Zm-5.47%2C2.5L89%2C54H25.52L19%2C22.2Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
            alt="Scroll to top"
          />
          { cartQuantity > 0 && (
            <div className="round-red" aria-label={ `${ cartQuantity } items in cart` }>
              <p>{ cartQuantity }</p>
            </div>
          ) }
        </RTGLink>
      ) }
      { !data.checkout && data.scrolled && (
        <div
          className={ classNames('scroll-to-top', {
            'fade-in': data.scrolled,
            'fade-out': !data.scrolled && data.fadeOut,
          }) }
          aria-label="scroll to top"
          aria-hidden={ !data.scrolled && data.fadeOut }
          onClick={ () => attemptScrollToTop() }
        >
          <p>^</p>
        </div>
      ) }
      <Footer checkout={ data.checkout } />
    </>
  )
}
