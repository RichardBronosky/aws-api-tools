// Helpers that get/set values from Cloudfront Cookies.

import uuidv4 from 'uuid/v4'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const getSessionId = () => {
  const sessionId = cookies.get('session_id')
  const devSessionId = uuidv4()
  if (sessionId) {
    return sessionId
  } else {
    cookies.set('session_id', devSessionId)
    return devSessionId
  }
}
