import React from 'react'
import '../../../assets/css/components/product/product-parts/see-in-stores.sass'
import SeeInStoresModal from './see-in-stores-modal'
import { addToDataLayer } from '../../../lib/helpers/google-tag-manager'

export default class SeeInStores extends React.Component {
  state = {
    modalOpen: false,
  }

  onSeeInStore = () => {
    const { sku, componentPage } = this.props
    addToDataLayer('click', componentPage, 'see in stores', sku)
    if (!this.state.modalOpen) {
      this.setState({
        modalOpen: true,
      })
    }
  }

  closeModal = () => {
    if (this.state.modalOpen) {
      this.setState({
        modalOpen: false,
      })
    }
  }

  render() {
    const { product, zip, customButtonText, lia } = this.props
    return (
      <>
        <button className="see-in-store-button grid-x" onClick={ () => this.onSeeInStore() }>
          <div className="small-12">
            <img
              className="icon location"
              alt=""
              aria-hidden="true"
              role="presentation"
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2052.44%2075.69%22%20fill%3D%22%232f5294%22%3E%3Ctitle%3Eicon-location%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M52.44%2C26.22A26.22%2C26.22%2C0%2C0%2C0%2C0%2C26.22q0%2C.66%2C0%2C1.32c0%2C.44%2C0%2C.87%2C0%2C1.32C0%2C43.34%2C26.22%2C75.69%2C26.22%2C75.69S52.44%2C43.34%2C52.44%2C28.86q0-.67%2C0-1.32T52.44%2C26.22ZM26.22%2C39.52A12.17%2C12.17%2C0%2C1%2C1%2C38.39%2C27.35h0A12.17%2C12.17%2C0%2C0%2C1%2C26.22%2C39.52Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
            />
            { customButtonText ? customButtonText : 'See In Store' }
          </div>
        </button>
        { this.state.modalOpen && (
          <SeeInStoresModal
            modalOpen={ this.state.modalOpen }
            closeModal={ this.closeModal }
            zip={ zip }
            product={ product }
            lia={ lia }
          />
        ) }
      </>
    )
  }
}
