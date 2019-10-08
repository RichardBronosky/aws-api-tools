import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import CreditOptions from '../../components/credit-options'

export default ({ props }) => (
  <Layout { ...props }>
    <Helmet title="Rooms To Go Credit Card: Application for RTG Financing" />
    <CreditOptions />
  </Layout>
)
