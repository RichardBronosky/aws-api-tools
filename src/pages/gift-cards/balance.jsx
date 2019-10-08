import React from 'react'
import Helmet from 'react-helmet'
import Layout from '@components/layout'
import GiftCardBalance from '@components/gift-cards/balance'

export default ({ props }) => (
  <Layout { ...props }>
    <Helmet title="Check Your Rooms To Go Gift Card Balance Online" />
    <GiftCardBalance />
  </Layout>
)
