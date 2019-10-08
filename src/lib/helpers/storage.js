export const getFromBrowserStorage = (type, object) => {
  let storageObject
  if (typeof window !== 'undefined') {
    if (type === 'session') storageObject = sessionStorage.getItem(object)
    else if (type === 'local') {
      try {
        storageObject = localStorage.getItem(object)
      } catch {
        storageObject = sessionStorage.getItem(object)
      }
    } else throw new Error("Unsupported storage type. Must be 'session' or 'local' storage.")
  }
  if (storageObject) {
    let objOut
    try {
      objOut = JSON.parse(storageObject)
    } catch {
      objOut = storageObject
    }
    return objOut
  }
}

export const saveLocalStorage = (name, object) => {
  const objectToStore = typeof object !== 'string' ? JSON.stringify(object) : object
  try {
    localStorage.setItem(name, objectToStore)
  } catch (err) {
    sessionStorage.setItem(name, objectToStore)
  }
}
