import React from 'react'
import { connect } from 'react-redux'
import { getDeliveryDate, getDeliverySpecificBody } from '../../../../../lib/helpers/checkout/delivery-section'
import { updateDelivery } from '../../../../../lib/services/checkout'
import DeliveryModal from './delivery-modal'
import { setOrder } from '../../../../../redux/modules/checkout'

class DeliveryModalWrapper extends React.Component {
  state = {
    showDeliveryModal: false,
    selectedDeliveryDate: {
      date: '',
      readable: '',
    },
    selectedPickupDate: {
      date: '',
      readable: '',
    },
    deliveryModalInfo: {
      deliver: true,
      pickup: false,
    },
    loading: false,
    error: false,
  }

  componentDidMount() {
    const { order, deliveryCalendar } = this.props
    if (order && deliveryCalendar.length > 0) {
      const deliveryDate = order.deliveryDate
      if (order.isPickup) {
        this.setState({
          deliveryModalInfo: {
            deliver: false,
            pickup: true,
          },
        })
        const selectedPickupDate = deliveryDate || deliveryCalendar.filter(date => date.isPickup)[0]
        const selectedDeliveryDate = deliveryCalendar.filter(date => date.isStandardDelivery)[0]
        this.setState({
          selectedPickupDate,
          selectedDeliveryDate,
        })
      } else {
        const selectedPickupDate = deliveryCalendar.filter(date => date.isPickup)[0]
        const selectedDeliveryDate = deliveryCalendar.filter(date => date === deliveryDate)[0]
        this.setState({
          selectedDeliveryDate,
          selectedPickupDate,
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { order, deliveryCalendar } = this.props
    const { showDeliveryModal } = this.state
    if (prevState.showDeliveryModal !== showDeliveryModal && showDeliveryModal) {
      this.setState({
        selectedDeliveryDate: getDeliveryDate(order, deliveryCalendar),
        selectedPickupDate: getDeliveryDate(order, deliveryCalendar, true),
      })
    }
  }

  setSelectedDeliveryDate = (event, selectedDeliveryDate) => {
    event.preventDefault()
    this.setState({
      selectedDeliveryDate,
    })
  }

  setSelectedPickupDate = (event, selectedPickupDate) => {
    event.preventDefault()
    this.setState({
      selectedPickupDate,
    })
  }

  setDeliveryModalInfo = (info, field) => {
    if (field === 'deliver') {
      this.setState({
        deliveryModalInfo: {
          deliver: info,
          pickup: !info,
        },
      })
    } else {
      this.setState({
        deliveryModalInfo: {
          pickup: info,
          deliver: !info,
        },
      })
    }
  }

  updateDeliveryDate = (date, isPickup) => {
    const { order, onSetOrder } = this.props
    this.setState({ loading: true })
    if (order) {
      order.deliveryDate = date.date
      updateDelivery(getDeliverySpecificBody(order, isPickup))
        .then(order => {
          onSetOrder(order)
          this.closeModal()
          this.setState({ loading: false, error: false })
        })
        .catch(() => {
          this.setState({ loading: false, error: true })
        })
    }
  }

  closeModal = () => {
    this.setState({
      selectedDeliveryDate: {
        date: '',
        readable: '',
      },
      selectePickupDate: {
        date: '',
        readable: '',
      },
      showDeliveryModal: false,
    })
  }

  showDeliveryModal = e => {
    e.preventDefault()
    this.setState({
      showDeliveryModal: true,
    })
  }

  render() {
    const { order, deliveryCalendar } = this.props
    const {
      loading,
      error,
      selectedDeliveryDate,
      selectedPickupDate,
      showDeliveryModal,
      deliveryModalInfo,
    } = this.state
    return (
      <>
        <button
          className="change-delivery-btn"
          value="Change Delivery Date"
          aria-label="Change Delivery Date"
          onClick={ e => this.showDeliveryModal(e) }
        >
          More Delivery & Pickup Options
        </button>
        { order && deliveryCalendar.length > 0 && showDeliveryModal && selectedDeliveryDate && selectedPickupDate && (
          <DeliveryModal
            order={ order }
            loading={ loading }
            error={ error }
            modalOpen={ showDeliveryModal }
            closeModal={ this.closeModal }
            deliveryCalendar={ deliveryCalendar }
            selectedDeliveryDate={ selectedDeliveryDate }
            selectedPickupDate={ selectedPickupDate }
            setSelectedDeliveryDate={ this.setSelectedDeliveryDate }
            setSelectedPickupDate={ this.setSelectedPickupDate }
            deliveryModalInfo={ deliveryModalInfo }
            setDeliveryModalInfo={ this.setDeliveryModalInfo }
            updateDeliveryDate={ this.updateDeliveryDate }
          />
        ) }
      </>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetOrder: order => dispatch(setOrder(order)),
  }
}

const mapStateToProps = state => {
  return { ...state.checkout }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryModalWrapper)
