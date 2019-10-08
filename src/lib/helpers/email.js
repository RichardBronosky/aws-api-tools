import { emailSignup } from '../services/email'
import { getFromBrowserStorage } from './storage'
import { validateEmail, validateZip } from './string-helper'
import { getCurrentLocation } from './geo-location'
import { announce } from './aria-announce'
import { getLocation } from '../services/location'

export const emailSubscribe = (e, email, zip, error, setState) => {
  e.preventDefault()
  setState({
    loading: true,
    submitted: false,
  })
  const validEmail = validateEmail(email)
  const validZip = validateZip(zip)
  if (validEmail && validZip) {
    getLocation(zip)
      .then(loc => {
        const uuid = getFromBrowserStorage('local', 'uuid')
        const date = new Date().toISOString()
        const location = getCurrentLocation()
        emailSignup({
          email: email,
          sourcecode: 'ONLINE',
          sourcekey: uuid,
          subsourcecode: 'PROFILE',
          sourcedate: date,
          userid: uuid,
          zipcode: zip,
          storenumber:
            loc && loc.response && loc.response.distribution_index
              ? loc.response.distribution_index
              : location.distribution_index,
        })
          .then(() => {
            const message = 'Signed up for emails!'
            announce('Form Submitted: ' + message)
            setState({
              success: message,
              submitted: true,
              loading: false,
              email: '',
              zip: '',
            })
          })
          .catch(() => {
            const message = '*Unable to sign up for emails.'
            if (e.currentTarget && e.currentTarget.parentElement) {
              announce('Form Error: ' + message, e.currentTarget.parentElement)
            }
            setState({
              error: message,
              submitted: false,
              loading: false,
            })
          })
      })
      .catch(() => {
        const message = '*Unable to sign up for emails.'
        if (e.currentTarget && e.currentTarget.parentElement) {
          announce('Form Error: ' + message, e.currentTarget.parentElement)
        }
        setState({
          error: message,
          submitted: false,
          loading: false,
        })
      })
  } else {
    const check = () => {
      return !validEmail && !validZip
        ? '*Invalid email address and zip code'
        : !validEmail
        ? '*Invalid email address.'
        : '*Invalid zip code.'
    }
    if (e.currentTarget && e.currentTarget.parentElement) {
      announce('Form Error: ' + error, e.currentTarget.parentElement)
    }
    setState({
      error: check(),
      fields: [!validEmail, !validZip],
      submitted: false,
      loading: false,
    })
  }
}
