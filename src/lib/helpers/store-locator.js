import { weekdays } from './string-helper'
import { getFromBrowserStorage } from './storage'

export const getMarkers = (currentLat, currentLng, storeLocs) => {
  let markers = []
  let stores = storeLocs.filter(store => store.storeTypeId !== 'W')
  for (let i = 0; i < stores.length; i++) {
    stores[i]['distance'] = calculateDistance(
      currentLat,
      currentLng,
      stores[i]['latitude'] || stores[i].location.lat,
      stores[i]['longitude'] || stores[i].location.lon
    )
  }
  stores.sort((a, b) => {
    return a.distance - b.distance
  })
  stores.map((store, index) => {
    const storeDataFromFeed = getStoreInfoFromFeed(store.storeNumber)
    if (storeDataFromFeed && storeDataFromFeed.store_hours && index < 26) {
      markers.push({
        title: store.address1,
        name: getStoreName(store),
        lat: store.location.lat,
        lng: store.location.lon,
        city: store.city,
        state: store.state,
        storeNumber: store.storeNumber,
        zip: store.zip,
        phone: storeDataFromFeed.phone,
        hours: getStoreHours(storeDataFromFeed.store_hours),
        distance: Math.round(store.distance * 10) / 10,
        specialClosings: store.specialClosings,
      })
    }
  })
  return markers
}

export const getStoreName = store => {
  if (store.name && store.storeType) {
    return `${ store.city } - ${ store.name } ${ store.storeType }`
  } else {
    return `${ store.city } ${ store.storeType }`
  }
}

export const getStoreHours = store => {
  let day,
    hours = []
  for (let i = 0, n = weekdays.length; i < n; i++) {
    day = weekdays[i]
    hours.push({
      day: day,
      openTime: store[`${ day.toLowerCase() }Open`],
      closeTime: store[`${ day.toLowerCase() }Closed`],
    })
  }
  return hours
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0
  } else {
    const radlat1 = (Math.PI * lat1) / 180
    const radlat2 = (Math.PI * lat2) / 180
    const theta = lon1 - lon2
    const radtheta = (Math.PI * theta) / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    return ((Math.acos(dist) * 180) / Math.PI) * 60 * 1.1515 * 0.8684
  }
}

export const getStore = setOrder => {
  const order = setOrder || getFromBrowserStorage('session', 'order')
  if (order && order.distributionIndex) {
    return getStoreInfoFromFeed(order.distributionIndex)
  }
}

export const getStoreInfoFromFeed = storeNum => {
  const storeHoursFeed = require('../generators/data/store-hours-feed.json')
  if (storeNum && storeHoursFeed && storeHoursFeed[storeNum]) {
    return storeHoursFeed[storeNum]
  }
}
