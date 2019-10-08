import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import GiftCards from '@components/gift-cards/purchase'

export default ({ props }) => (
  <Layout { ...props }>
    <Helmet title="Buy Rooms To Go Gift Cards - Redeem Gift Card Online" />
    <GiftCards />
  </Layout>
)
