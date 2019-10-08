import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import CheckoutMain from '../components/checkout'

export default ({ props }) => (
  <Layout { ...props } checkout>
    <Helmet title={ 'Checkout - Rooms To Go' } meta={ [{ name: 'robots', content: 'noindex, nofollow' }] } />
    <CheckoutMain />
  </Layout>
)
