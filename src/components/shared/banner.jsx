import React, { PureComponent } from 'react'
import { graphql } from 'gatsby'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { InView } from 'react-intersection-observer'
import { trackImpression } from '../../lib/helpers/google-tag-manager'
import RTGLink from './link'
import '../../assets/css/components/shared/banner.sass'
import { CreateContent } from '../../lib/helpers/contentful-mapping'
import Responsive from 'react-responsive'
import { contentfulImage } from '../../lib/helpers/contentful'
import { navigate } from 'gatsby'
import RTGCreditModal from '@components/checkout/checkout-parts/payment-section/rtg-credit-modal'
import { getFinancePlans } from '@helpers/finance'
import { hasIn } from "lodash"
import InfoModal from './info-modal';

const Mobile = props => <Responsive { ...props } maxWidth={ 767 } />
const Desktop = props => <Responsive { ...props } minWidth={ 768 } />

class Banner extends PureComponent {
  state = { showFinanceModal: false }

  buttonNavigate = (e, url, trackingData, external = false) => {
    window.dataLayer.push(trackingData)
    if (e.target && (!e.target.className || (e.target.className && !e.target.className.includes('button')))) {
      if (external) {
        window.open(url, '_blank')
      } else {
        navigate(url)
      }
    }
  }

  render() {
    const banner = this.props.data
    const { showFinanceModal } = this.state
    const bannerPageIndex = this.props.index
    const trackingData = {
      event: 'ee_promoClick',
      ecommerce: {
        promoClick: {
          promotions: [{ contentIndex: bannerPageIndex, banner: banner.title }],
        },
      },
    }
    const container = { type: 'banner', label: banner.title }
    const buttons = banner.buttons ? CreateContent(banner.buttons, null, true, container) : null
    const placement = this.props.placement
    let contentImageUrl =
      this.props.isMobile && banner.mobileImage
        ? banner.mobileImage.file.url
        : banner.desktopImage
        ? banner.desktopImage.file.url
        : ''
    if (contentImageUrl) {
      contentImageUrl = contentfulImage(contentImageUrl)
    }
    const contentLinkColor = banner.contentLinkColor ? { color: banner.contentLinkColor } : {}
    const bannerContentLink = banner.contentLink ? (
      <RTGLink
        data={ banner.contentLink }
        style={ contentLinkColor }
        category="promotion"
        action="promotion click"
        label={ banner.title }
        value={ bannerPageIndex }
        trackingData={ trackingData }
      />
    ) : (
      ''
    )
    const bannerStyle = {
      textAlign: banner.textPosition,
    }
    const bannerClass =
      banner &&
      banner.title &&
      banner.title
        .replace(/:/g, '')
        .replace(/\//g, '')
        .replace(/-/g, '')
        .split(' ')
        .join('')
        .toLowerCase()

    let gtm
    if (banner.link) {
      gtm = {
        category: banner.link.category,
        action: banner.link.action,
        label: banner.link.label,
        value: banner.link.value,
      }
    }

    const highestPriorityFinancePlan = getFinancePlans(null, null, true)[0]

    return (
      <section className="grid-x grid-margin-x grid-margin-y grid-padding-y">
        <div className="cell small-12">
          <InView
            as="div"
            onChange={ inView => trackImpression(inView, bannerPageIndex, banner) }
            className={ classNames('banner', {
              'full-width': banner.desktopBackgroundImage && !banner.displayContent,
              'placement-nav': placement === 'nav',
            }) }
            triggerOnce={ true }
            key={ banner.contentful_id }
          >
            { banner.desktopBackgroundImage && (
              <img
                className={ classNames('image', {
                  'background-black': banner.backgroundColor === 'Black',
                  'background-blue': banner.backgroundColor === 'Blue',
                  'background-white': banner.backgroundColor === 'White',
                }) }
                alt=""
                aria-hidden="true"
                role="presentation"
                src={ contentfulImage(banner.desktopBackgroundImage.file.url) }
              />
            ) }
            { !banner.displayContent && (
              <div className={ classNames('banner-image') }>
                <Mobile>
                  { banner.mobileImage && (
                    <RTGLink
                      data={ banner.link }
                      category="promotion"
                      action="promotion click"
                      label={ banner.title }
                      value={ bannerPageIndex }
                      trackingData={ trackingData }
                      noAriaLabel
                    >
                      <img
                        alt={ banner.imageAltText }
                        src={ banner.mobileImage ? contentfulImage(banner.mobileImage.file.url) : '' }
                        className="banner-mobile-image"
                      />
                    </RTGLink>
                  ) }
                </Mobile>
                <Desktop>
                  { banner.desktopImage && (
                    <RTGLink
                      data={ banner.link }
                      category="promotion"
                      action="promotion click"
                      label={ banner.title }
                      value={ bannerPageIndex }
                      trackingData={ trackingData }
                      noAriaLabel
                    >
                      <img
                        alt={ banner.imageAltText }
                        src={ banner.desktopImage ? contentfulImage(banner.desktopImage.file.url) : '' }
                      />
                    </RTGLink>
                  ) }
                </Desktop>
              </div>
            ) }
            { banner.displayContent && (
              <div className={ classNames('banner-with-content', 'center') } style={ bannerStyle }>
                <div
                  gtm-category={ gtm && gtm.category }
                  gtm-action={ gtm && gtm.action }
                  gtm-label={ gtm && gtm.label }
                  gtm-value={ gtm && gtm.value }
                  className="banner-button"
                >
                  { contentImageUrl && (
                    <img
                      className={ classNames('content-image', {
                        'background-black': !banner.desktopBackgroundImage && banner.backgroundColor === 'Black',
                        'background-blue': !banner.desktopBackgroundImage && banner.backgroundColor === 'Blue',
                        'background-white': !banner.desktopBackgroundImage && banner.backgroundColor === 'White',
                      }) }
                      src={ contentImageUrl }
                      alt={ banner.imageAltText || '' }
                      role={ (!banner.imageAltText && 'presentation') || null }
                      aria-hidden={ (!banner.imageAltText && 'true') || null }
                    />
                  ) }
                  { banner.contentHorizontalRuleColor && (
                    <style
                      dangerouslySetInnerHTML={ {
                        __html: `.${ bannerClass } hr {border-color:${ banner.contentHorizontalRuleColor } !important}`,
                      } }
                    />
                  ) }
                  <div
                    className={ classNames(
                      'banner-content',
                      banner.contentPosition,
                      getContainerSize(banner.containerSize)
                    ) }
                    // style={ { padding: banner.contentPadding ? `${ banner.contentPadding }px` : '32px' } }
                  >
                    <div className={ classNames('banner-content-wrapper') }>
                      { banner.contentText && (
                        <div
                          className={ classNames('banner-content-text', bannerClass) }
                          dangerouslySetInnerHTML={ {
                            __html: banner.contentText.childMarkdownRemark.html,
                          } }
                        />
                      ) }
                      { buttons && <div className={ classNames('banner-buttons') }>{ buttons }</div> }
                      { banner.contentLink && <div className={ classNames('banner-link') }>{ bannerContentLink }</div> }
                      { !!banner.isFinanceBanner && (
                        <div className="finance-buttons">
                          <RTGLink
                            data={ { url: process.env.GATSBY_SYNCHRONY_URL, target: '_blank' } }
                            category="credit-card"
                            action="apply-now"
                            className="button apply-button"
                            label="banner"
                            value="Apply now"
                            trackingData={ { event: 'ee_applyNowClick' } }
                            noAriaLabel
                          >
                            Apply Now
                          </RTGLink>
                          <button
                            className="learn-more"
                            gtm-category="credit-card"
                            gtm-action="learn-more"
                            gtm-label="banner"
                            onClick={ () => this.setState({ showFinanceModal: true }) }
                          >
                            Learn More
                          </button>
                        </div>
                      ) }
                    </div>
                  </div>
                </div>
                { showFinanceModal &&
                  hasIn(highestPriorityFinancePlan, 'promoMessage.childMarkdownRemark.html') && (
                    <InfoModal
                      label={ 'Rooms To Go Credit Options' }
                      mdlClass={ 'rtg-credit-modal' }
                      shouldShowModal={showFinanceModal}
                      closeModal={ () => this.setState({ showFinanceModal: false }) }
                    >
                      <div dangerouslySetInnerHTML={ { __html: highestPriorityFinancePlan.promoMessage.childMarkdownRemark.html } } /> 
                    </InfoModal>
                  ) }
              </div>
            ) }
          </InView>
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}

export default connect(mapStateToProps)(Banner)

export const banner = graphql`
  fragment Banner on ContentfulBanner {
    title
    startDate
    endDate
    displayContent
    isFinanceBanner
    contentText {
      childMarkdownRemark {
        html
      }
    }
    contentHorizontalRuleColor
    textPosition
    contentPosition
    containerSize
    contentLinkColor
    link {
      ...Link
    }
    contentLink {
      ...Link
    }
    buttons {
      __typename
      ...Button
    }
    imageAltText
    desktopBackgroundImage {
      ...Image
    }
    backgroundColor
    mobileImage {
      ...Image
    }
    desktopImage {
      ...Image
    }
    contentPadding
    contentful_id
  }
`

function getContainerSize(containerSize) {
  var size
  switch (containerSize) {
    case '50%':
      size = 'banner-content-medium'
      break
    case '100%':
      size = 'banner-content-full'
      break
    default:
      size = 'banner-content-small'
  }
  return size
}
