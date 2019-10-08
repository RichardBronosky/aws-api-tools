import { navigate } from 'gatsby'
import { getLocation } from '..//services/location'
import { validateZip } from './string-helper'

export const handleSubmit = (e, zipCode, errorMessage, setState) => {
  e.preventDefault()
  if (validateZip(zipCode)) {
    if (errorMessage) {
      setState({ errorMessage: null })
    }
    getLocation(zipCode)
      .then(data => {
        const deliveryZone =
          data.success && data.response && data.response.delivery_zone ? data.response.delivery_zone : null
        if (deliveryZone) {
          if (deliveryZone.toLowerCase() === 'ups') {
            setState({
              errorMessage:
                'Sorry, we do not deliver furniture to your area. Select accessories are available and will ship via UPS, as indicated.',
            })
          } else {
            navigate(`/delivery-charges-zone-${ deliveryZone.toLowerCase() }`)
          }
        } else {
          setState({ errorMessage: 'Sorry, something went wrong. Please try again with a valid zip code.' })
        }
      })
      .catch(() => setState({ errorMessage: 'Sorry, something went wrong. Please try again with a valid zip code.' }))
  } else {
    setState({ errorMessage: 'Please enter a valid zip code.' })
  }
}
