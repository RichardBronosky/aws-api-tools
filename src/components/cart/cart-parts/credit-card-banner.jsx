import React, { useState } from 'react'
import RTGLink from '@shared/link'
import { getFinanceMarketingMessageData, getFinancePlans } from '@helpers/finance'
import '@comp-sass/cart/cart-parts/credit-card-banner.sass'
import InfoModal from '@shared/info-modal'
import { hasIn } from 'lodash'

const CreditCardBanner = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const financeBannerData = getFinanceMarketingMessageData()
  const highestFinancePlanMsg = getFinancePlans()[0].promoMessage

  return (
    <div className="credit-card-banner cell small-12">
      <div className="grid-x">
        <img
          src={ `${ process.env.GATSBY_S3_IMAGE_URL }rtg-cc.png` }
          alt="Rooms To Go Credit Card"
          className="credit-card-image small-4 large-2"
        />
        <div className="cell small-12 large-7">
          { financeBannerData && financeBannerData.siteFriendlyLabel && (
            <strong>{ financeBannerData.siteFriendlyLabel }</strong>
          ) }
          { financeBannerData && financeBannerData.marketingMessage && (
            <div
              dangerouslySetInnerHTML={ {
                __html: financeBannerData.marketingMessage,
              } }
            />
          ) }
        </div>
        <div className="small-12 large-3 buttons-wrapper">
          <RTGLink
            target="_blank"
            data={ {
              url: process.env.GATSBY_SYNCHRONY_URL,
              title: 'Rooms To Go Credit Options',
              category: 'credit-card',
              action: 'apply-now',
              label: 'cart',
            } }
            className="blue-action-btn small-12 large-4"
          >
            Apply Now
          </RTGLink>
          <button
            gtm-category={ 'credit-card' }
            gtm-action={ 'learn more' }
            gtm-label={ 'cart' }
            className={ 'info-modal credit-learn-more' }
            onClick={ () => setShouldShowModal(true) }
          >
            Learn more
          </button>
        </div>
      </div>
      { shouldShowModal && hasIn(highestFinancePlanMsg, 'childMarkdownRemark.html') && 
        <InfoModal
          label={ 'Rooms To Go Credit Options' }
          mdlClass={ 'rtg-credit-modal' }
          shouldShowModal={shouldShowModal}
          closeModal={ () => setShouldShowModal(false) }
        >
          <div dangerouslySetInnerHTML={ { __html: highestFinancePlanMsg.childMarkdownRemark.html } } />
        </InfoModal>
      }
    </div>
  )
}

export default CreditCardBanner