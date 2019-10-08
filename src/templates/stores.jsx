import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import StoreLocator from '../components/store-locator/store-locator'

export default props => (
  <Layout { ...props }>
    <Helmet
      title="Rooms To Go Store Locator: Best Local Furniture Stores Near By"
      meta={ [
        {
          name: 'description',
          content:
            'Rooms To Go store locations and hours of operation. Use our store locator to find the best furniture store near you. Find affordable local Rooms To Go furniture stores and outlets nearby.',
        },
      ] }
    />
    <StoreLocator data={ props.pageContext.stores } />
  </Layout>
)
