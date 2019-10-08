import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import RTGLink from '../shared/link'
import { weekdays, getStandardTime } from '../../lib/helpers/string-helper'
import '../../assets/css/components/store-locator/store-info.sass'

export default ({ selectedMarker }) => {
  let hours
  if (selectedMarker.hours && !selectedMarker.hours.regularHours) {
    hours = selectedMarker.hours
  } else if (selectedMarker.hours && selectedMarker.hours.regularHours) {
    hours = selectedMarker.hours.regularHours
  }
  const currentDay = weekdays[new Date().getDay()]
  return (
    <Provider store={ store }>
      <div className="store-info">
        <h2 className="store-name">{ selectedMarker.name }</h2>
        <div className="storeAddress">
          <RTGLink
            data={ {
              url: `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${ selectedMarker.lat },${ selectedMarker.lng }`,
              title: `Directions to ${ selectedMarker.name }`,
              category: 'store locator',
              action: 'Directions store map click',
              label: 'Directions to store',
            } }
            target="_blank"
            className="store-address-link"
          >
            { selectedMarker.title }
            <br />
            { selectedMarker.city }, { selectedMarker.state } { selectedMarker.zip }
          </RTGLink>
          <br />
          { (selectedMarker.phone || selectedMarker.phoneNumber) && (
            <RTGLink
              data={ {
                url: `tel:${ (selectedMarker.phone ? selectedMarker.phone : selectedMarker.phoneNumber).replace(
                  '/',
                  '-'
                ) }`,
                title: `Call ${ selectedMarker.name }`,
                category: 'store locator',
                action: 'Call store map click',
                label: 'Call store',
              } }
            >
              { (selectedMarker.phone ? selectedMarker.phone : selectedMarker.phoneNumber).replace('/', '-') }
            </RTGLink>
          ) }
          { hours && (
            <div className="today-hours">
              { hours &&
                hours.map((hour, i) => {
                  const day = hour.day ? hour.day : weekdays[hour.dayIndex]
                  if (day === currentDay) {
                    return (
                      <div className="hour" key={ i }>
                        <span className="day">Today</span>: { getStandardTime(hour.openTime) } -{ ' ' }
                        { getStandardTime(hour.closeTime) }
                      </div>
                    )
                  }
                }) }
            </div>
          ) }
        </div>
      </div>
    </Provider>
  )
}
