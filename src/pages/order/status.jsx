import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import OrderStatus from '../../components/order/status'

export default () => (
  <Layout>
    <Helmet title="Order Status - Rooms To Go" />
    <OrderStatus />
  </Layout>
)
