export const attemptScrollToTop = () => {
  try {
    window.scroll({ top: 0, behavior: 'smooth', block: 'start' })
  } catch {
    //do nothing
  }
}

export const getURLParam = (key, windowData) => {
  let paramValue = null
  let paramString
  if (windowData && windowData.location && windowData.location.search) {
    paramString = windowData.location.search
  } else if (typeof window !== 'undefined' && window.location && window.location.search) {
    paramString = window.location.search
  }
  if (paramString) {
    const params = paramString.replace('?', '').split('&')
    const paramIndex = params.findIndex(param => param.includes(key))
    if (paramIndex >= 0) {
      paramValue = params[paramIndex].split('=')[1]
    }
  }
  return paramValue
}
