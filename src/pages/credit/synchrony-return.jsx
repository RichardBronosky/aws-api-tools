import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import SynchronyReturn from '../../components/credit-options/synchrony-return'

export default ({ props }) => (
  <Layout { ...props }>
    <Helmet title="Rooms To Go" meta={ [{ name: 'robots', content: 'index, follow' }] } />
    <SynchronyReturn />
  </Layout>
)
