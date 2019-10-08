import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Cart from '../components/cart'

export default ({ props }) => (
  <Layout { ...props } cartPage>
    <Helmet title={ 'Shopping Cart - Rooms To Go' } meta={ [{ name: 'robots', content: 'noindex, nofollow' }] } />
    <Cart />
  </Layout>
)
