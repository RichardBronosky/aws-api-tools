import React from 'react'
import Helmet from 'react-helmet'
import affirmLogo from '../../../../../assets/images/affirm_logo.svg'
import '../../../../../assets/css/components/checkout/checkout-parts/payment-section/affirm.sass'

export default ({ affirmLoaded, affirmFunc, affirm_config, affirmClick }) => (
  <>
    { !affirmLoaded && (
      <Helmet>
        <script>{ affirmFunc(window, affirm_config, 'affirm', 'checkout', 'ui', 'script', 'ready') }</script>
      </Helmet>
    ) }
    { affirmLoaded && (
      <button className="affirm-button" value="Affirm Checkout" onClick={ affirmClick }>
        Pay with <img alt="Affirm Logo" src={ affirmLogo } />
      </button>
    ) }
  </>
)
