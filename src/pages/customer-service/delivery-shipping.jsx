import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import ShippingCosts from '../../components/customer-service/shipping-costs'

export default ({ props }) => (
  <Layout { ...props }>
    <Helmet title={ 'Shipping Costs - Rooms To Go' } />
    <ShippingCosts />
  </Layout>
)
