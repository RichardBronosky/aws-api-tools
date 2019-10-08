import React from 'react'
import classNames from 'classnames'
import RTGLink from '../../components/shared/link'
import { letters, getStandardTime, weekdays } from '../../lib/helpers/string-helper.js'
import '../../assets/css/components/store-locator/map-locations-list.sass'

const showDay = (hour, index, currentDay, tomorrowDay) => {
  let daytxt = false
  const day = hour.day ? hour.day : weekdays[hour.dayIndex]
  if (day == currentDay) daytxt = 'Today'
  if (day == tomorrowDay) daytxt = 'Tomorrow'
  if (daytxt) {
    return (
      <div className="hour" key={ index }>
        <span className="day">{ daytxt }</span>: { getStandardTime(hour.openTime) } - { getStandardTime(hour.closeTime) }
      </div>
    )
  }
}

export default ({ markers, onLocationClick, showHours, toggleShowHours, currentDay, tomorrowDay, lia }) => (
  <div className="locations">
    { markers.map((mark, index) => {
      let hours
      if (mark.hours && !mark.hours.regularHours) {
        hours = mark.hours
      } else if (mark.hours && mark.hours.regularHours) {
        hours = mark.hours.regularHours
      }
      const phone = mark.phone || mark.phoneNumber
      return (
        <div className="locationRow" onClick={ () => onLocationClick(index, mark) } key={ index }>
          <div className="imgCol">
            <img src={ `http://maps.google.com/mapfiles/marker${ letters[index] }.png` } />
          </div>
          <div className="addrCol">
            <span className="storeName">
              { !lia ? (
                mark.name
              ) : (
                <RTGLink
                  data={ {
                    url: window && `${ window.location.pathname }?storeCode=${ mark.storeNumber }`,
                    title: `Change Location to ${ mark.name } Store`,
                    category: 'product-lia',
                    action: 'change location click',
                    label: mark.name,
                  } }
                >
                  { mark.name }
                </RTGLink>
              ) }
            </span>
            <br />
            <div className="phone">
              <RTGLink
                data={ {
                  url: `tel:${ phone.replace('/', '-') }`,
                  title: `Call ${ mark.name } Store`,
                  category: 'store-locator',
                  action: 'call store click',
                  label: mark.name,
                } }
              >
                { phone.replace('/', '-') }
              </RTGLink>
            </div>
            <div className="address">
              <RTGLink
                data={ {
                  url: `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${ mark.lat },${ mark.lng }`,
                  title: `Directions to ${ mark.name }`,
                  category: 'store locator',
                  action: 'Directions store map click',
                  label: 'Directions to store',
                } }
                target="_blank"
                className="store-address-link"
              >
                { mark.title }
                <br />
                { mark.city }, { mark.state } { mark.zip }
              </RTGLink>
              <br />
              { mark.distance && <>{ mark.distance } miles</> }
            </div>
            <div className="hours">
              { mark.specialClosings && (
                <span
                  className="special-closings"
                  dangerouslySetInnerHTML={ { __html: mark.specialClosings.markdown.childMarkdownRemark.html } }
                />
              ) }
              <div className="heading">Store Hours</div>
              { hours &&
                hours.map((hour, i) => {
                  if (!showHours[index]) {
                    return showDay(hour, i, currentDay, tomorrowDay)
                  } else {
                    return (
                      <div
                        className={ classNames('hour', {
                          hidden: i > 0 && !showHours[index],
                        }) }
                        key={ i }
                      >
                        <span className="day">{ hour.day ? hour.day : weekdays[hour.dayIndex] }</span>:{ ' ' }
                        { hour.openTime && hour.closeTime
                          ? `${ getStandardTime(hour.openTime) } - ${ getStandardTime(hour.closeTime) }`
                          : 'Closed' }
                      </div>
                    )
                  }
                }) }
            </div>
            <div>
              <button className="showAllBtn" value="Show All" onClick={ () => toggleShowHours(index) }>
                { !showHours[index] ? 'Show All' : 'Show Less' }
              </button>
            </div>
          </div>
        </div>
      )
    }) }
  </div>
)
