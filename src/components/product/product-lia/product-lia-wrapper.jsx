import React from 'react'
import { getLocation } from '../../../lib/services/location'
import { getSeeInStore } from '../../../lib/services/product'
import ProductLIA from './product-lia'

export default class ProductLIAWrapper extends React.Component {
  state = {
    region: 'FL',
    zone: '0',
    available: true,
  }

  componentDidMount() {
    const { store, product } = this.props
    getLocation(store.zip)
      .then(data => data.response && this.setState({ region: data.response.region, zone: data.response.price_zone }))
      .then(() => {
        getSeeInStore(product.sku, store.zip)
          .then(data => {
            this.setState({
              available: data.filter(loc => loc.storeNumber == store.storeNumber).length > 0,
            })
          })
          .catch(() =>
            this.setState({
              available: false,
            })
          )
      })
  }

  render() {
    const { product, store } = this.props
    const { region, zone, available } = this.state
    return <ProductLIA product={ product } store={ store } region={ region } zone={ zone } available={ available } />
  }
}
