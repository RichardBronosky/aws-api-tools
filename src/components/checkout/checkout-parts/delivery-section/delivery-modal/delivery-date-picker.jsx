import React from 'react'
import classNames from 'classnames'
import SimpleSlider from '../../../../shared/slider'
import {
  getDistributionCenterHours,
  getDeliverySliderIndex,
} from '../../../../../lib/helpers/checkout/delivery-section'
import '../../../../../assets/css/components/checkout/checkout-parts/delivery-section/delivery-date-picker.sass'

export default ({ dates, selectedDate, setSelectedDate, pickup, order }) => {
  const slideIndex = getDeliverySliderIndex(selectedDate, dates)
  return (
    <div
      className={ classNames('delivery-date-picker', {
        express: dates.filter(date => date.isExpressDelivery).length > 0 && !pickup,
      }) }
    >
      { dates.length > 0 && (
        <SimpleSlider
          data={ {
            heading: '',
          } }
          maxSlides="5"
          minSlidesMobile="5"
          infinite={ false }
          initialSlide={ slideIndex >= 0 ? slideIndex : 0 }
        >
          { dates.map((date, index) => (
            <div
              key={ index }
              className={ classNames('date', {
                'selected-date': selectedDate.readable === date.readable,
              }) }
              onClick={ e => setSelectedDate(e, date) }
            >
              <>
                { date.date && (
                  <>
                    <p className="month">{ date.readable.split(' ')[0].substr(0, 3) }</p>
                    <p className="day">{ date.readable.split(' ')[1] }</p>
                    <p className="weekday">{ date.dayOfWeek }</p>
                    { pickup && <p className="hours">{ getDistributionCenterHours(order, date).toUpperCase() }</p> }
                  </>
                ) }
                { date.isExpressDelivery && !pickup && <p className="restrictions">*Delivery restrictions apply</p> }
              </>
            </div>
          )) }
        </SimpleSlider>
      ) }
      { dates.length < 1 && (
        <SimpleSlider
          data={ {
            heading: '',
          } }
          maxSlides="5"
          infinite={ false }
          initialSlide={ 0 }
        >
          <div className="date">No dates available.</div>
        </SimpleSlider>
      ) }
    </div>
  )
}
