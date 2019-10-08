import React from 'react'
import RTGLink from '../../../../shared/link'
import '../../../../../assets/css/components/checkout/checkout-parts/delivery-section/distribution-center-popup.sass'

export default class DistributionCenterPopup extends React.Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (
      event &&
      event.target &&
      this.node &&
      !this.node.contains(event.target) &&
      (event.target.className &&
        typeof event.target.className === 'string' &&
        !event.target.className.includes('distribution-center-button'))
    ) {
      this.props.togglePopup(event)
    }
  }

  render() {
    const { store, open, togglePopup } = this.props
    const name = `${ store && store.city } Distribution Center`
    return (
      <div className="distribution-center-popup">
        <button
          className="distribution-center-button"
          alt={ name }
          aria-expanded={ open }
          tabIndex="0"
          onClick={ e => togglePopup(e) }
        >
          { name }
        </button>
        { open && (
          <div
            className="popup container"
            ref={ node => {
              this.node = node
            } }
          >
            { store && (
              <>
                <p>{ `${ store.address1 }${ store.address2 ? ' ' + store.address2 : '' }, ${ store.city }, ${ store.state } ${
                  store.zip
                }` }</p>
                <div>
                  Contact:
                  <RTGLink
                    data={ {
                      url: `tel:${ store.phone.replace('/', '-') }`,
                      title: 'Call distribution center',
                      category: 'cart/checkout',
                      action: 'Call distribution center click',
                      label: 'Call distribution center',
                    } }
                  >
                    { store.phone.replace('/', '-') }
                  </RTGLink>
                </div>
              </>
            ) }
          </div>
        ) }
      </div>
    )
  }
}
