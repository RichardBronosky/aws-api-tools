import Cookies from 'universal-cookie'
import Axios from 'axios'
import { store } from '../../redux/store'

const cookies = new Cookies()

export const getCurrentLocation = () => {
  return cookies.get('rtg_location') || store.getState().location.rtg_location
}

export async function geoLocation(address, reload = true) {
  let geocode = null
  let error = false
  try {
    geocode = await Axios.get(
      `https://maps.google.com/maps/api/geocode/json?address=${ address }&key=${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`
    )
  } catch (err) {
    error = true
    return error
  }
  let primaryLocation = geocode.data.results[0]
  if (!primaryLocation || (primaryLocation && !primaryLocation.formatted_address.includes('USA'))) {
    error = true
    return error
  }
  let postal_code_comp = primaryLocation.address_components.find(comp => comp.types.includes('postal_code'))
  let state = primaryLocation.address_components.find(comp => comp.types.includes('administrative_area_level_1'))
  let county = primaryLocation.address_components.find(comp => comp.types.includes('administrative_area_level_2'))
  state = state && state.long_name
  county = county && county.long_name.substr(0, county.long_name.length - 7)
  let city = primaryLocation.address_components.find(comp => comp.types.includes('locality'))
  city = city && city.short_name
  let postal_code = ''
  if (postal_code_comp) {
    postal_code = postal_code_comp.short_name
  } else if (!postal_code_comp && !city) {
    error = true
    return error
  } else {
    let location = geocode.data.results[0].geometry.location
    geocode = await Axios.get(
      `https://maps.google.com/maps/api/geocode/json?latlng=${ location.lat },${ location.lng }&key=${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`
    )
    geocode.data.results.forEach(item => {
      if (postal_code === '') {
        try {
          postal_code = item.address_components.find(comp => comp.types.includes('postal_code')).short_name
        } catch (e) {}
      }
    })
  }
  cookies.remove('rtg_region', { path: '/' })
  cookies.set('rtg_zip', postal_code, { path: '/' })
  if (process.env.NODE_ENV === 'development') {
    let rtg_location = cookies.get('rtg_location')
    cookies.remove('rtg_location')
    rtg_location.city = city ? city : ''
    rtg_location.state = state
    rtg_location.county = county
    rtg_location.zip = postal_code
    // Development zip code OOM
    let postal_int = parseInt(postal_code)
    if (postal_int === 80202) {
      rtg_location.region = 'OOM'
    } else if (
      postal_int === 73301 ||
      (postal_int >= 75001 && postal_int <= 79999) ||
      (postal_int >= 88510 && postal_int <= 88589)
    ) {
      rtg_location.region = 'TX'
    } else if (postal_int >= 32004 && postal_int <= 34997) {
      rtg_location.region = 'FL'
    } else {
      rtg_location.region = 'SE'
    }
    cookies.set('rtg_location', rtg_location, { path: '/' })
  }
  if (reload) {
    window.location.reload()
  }
}

export const getLatLng = async zip => {
  let geocode = null
  let error = false
  try {
    geocode = await Axios.get(
      `https://maps.google.com/maps/api/geocode/json?address=${ zip }&key=${ process.env.GATSBY_GOOGLE_BROWSER_API_KEY }`
    )
  } catch (err) {
    error = true
    return error
  }
  let primaryLocation = geocode.data.results[0]
  if (!primaryLocation) {
    error = true
    return error
  } else {
    return {
      lat: primaryLocation.geometry.location.lat,
      lng: primaryLocation.geometry.location.lng,
    }
  }
}

export const getRegionZone = () => {
  const rtg_location = getCurrentLocation()
  return {
    region:
      rtg_location && typeof rtg_location.region !== 'undefined' ? rtg_location.region : process.env.GATSBY_RTG_REGION,
    zone: rtg_location && typeof rtg_location.price_zone !== 'undefined' ? rtg_location.price_zone : 0,
  }
}

export const abbreviateState = state => {
  if (state) {
    state = state.trim()
    if (state.length < 3) {
      state = state.toUpperCase()
      for (let i = 0; i < states.length; i++) {
        if (states[i][1] === state) {
          return state
        }
      }
      return null
    } else {
      state = state.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
      for (let i = 0; i < states.length; i++) {
        if (states[i][0] === state) {
          return states[i][1]
        }
      }
    }
  }
  return null
}

export const expandState = state => {
  for (let i = 0; i < states.length; i++) {
    if (states[i][1] === state) {
      return states[i][0]
    }
  }
}

export const states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['District Of Columbia', 'DC'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Puerto Rico', 'PR'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
]
