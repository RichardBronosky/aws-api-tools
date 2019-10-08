exports.genKey = () => {
  return Math.floor(Math.random() * 100000)
}
exports.isString = obj => {
  return Object.prototype.toString.call(obj) === '[object String]'
}

/* 
  Ex: isWholeWordInStr('red', 'upholstered') = false | isWholeWordInStr('red', 'upholstered/color/red') = true 
*/
exports.isWholeWordInStr = (str, word) => {
  return str.match(`(^|[^a-z])(${ word })([^a-z]|$)`, 'i')
}

exports.distinct = (value, index, self) => {
  return self.indexOf(value) === index
}

exports.getLastParamOfPath = () => {
  if (window) {
    const pathSplit = removeFirstAndLastSlash(window.location.pathname).split('/')
    return pathSplit ? pathSplit[pathSplit.length - 1] : ''
  }
}

exports.paramsIncludeKey = key => {
  if (window) {
    const pathSplit = window.location.pathname.split('/')
    return pathSplit ? pathSplit.includes(key) : false
  }
}

exports.titleCase = (str, splitters = [' ']) => {
  str = str.toLowerCase()
  for (let x = 0; x < splitters.length; x++) {
    let strArr = str.split(splitters[x])
    for (let y = 0; y < strArr.length; y++) {
      strArr[y] = strArr[y].charAt(0).toUpperCase() + strArr[y].slice(1)
    }
    str = strArr.join(splitters[x])
  }
  return str
}

exports.removeCamelCase = str => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .toLowerCase()
}

exports.slugGenerator = (category, sub_category = null, title = null, sku = null) => {
  let slugPath = `/${ slugify(category, { lower: true }) }`
  if (sub_category) {
    slugPath = slugPath + `/${ slugify(sub_category, { lower: true }) }`
  }
  if (title) {
    slugPath = slugPath + `/${ slugify(title, { lower: true }) }`
  }
  if (sku) {
    slugPath = slugPath + `/${ slugify(sku) }`
  }
  return slugPath
}

exports.decodeHtml = html => {
  var txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

const slugify = string => {
  const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;'
  const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(p, c => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/[^[\w\"]\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .replace(/["']/g, '-')
}
exports.slugify = slugify

exports.currencyFormatUS = (price, forceCents = false) => {
  price = Number(price)
  if (forceCents || !Number.isInteger(price)) {
    price = price.toFixed(2)
  } else {
    price = price.toFixed(0)
  }
  return `$${ price }`
}

exports.validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

exports.validatePhone = phone => {
  var re = /^[0-9]{3}?[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/
  return re.test(String(phone).toLowerCase())
}

exports.validateZip = zip => {
  var re = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  return re.test(String(zip).toLowerCase())
}

exports.cleanSearchUrl = string => {
  return string
    .replace(/-/g, '~')
    .replace(/\s/g, '-')
    .replace(/_family/g, '')
    .trim()
}

exports.cleanSearchParamValue = string => {
  return string.replace(/-/g, ' ').replace(/~/g, '-')
}

exports.stripHtml = string => {
  return string.replace(/(<([^>]+)>)/gi, '')
}

exports.months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

exports.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const removeFirstAndLastSlash = string => {
  return string.replace(/^\/|\/$/g, '')
}
exports.removeFirstAndLastSlash = removeFirstAndLastSlash

exports.getStandardTime = time => {
  time = time.split(':')
  const hours = Number(time[0])
  const minutes = Number(time[1])
  let timeValue
  if (hours > 0 && hours <= 12) {
    timeValue = '' + hours
  } else if (hours > 12) {
    timeValue = '' + (hours - 12)
  } else if (hours == 0) {
    timeValue = '12'
  }
  timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes
  return (timeValue += hours >= 12 ? 'pm' : 'am')
}

exports.letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]
