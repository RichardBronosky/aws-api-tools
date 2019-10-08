const stringHelper = require('./string-helper')

exports.getDateFull = date => {
  const newDate = new Date(date)
  return newDate
    ? `${ stringHelper.weekdays[newDate.getUTCDay()] }, ${ stringHelper.months[newDate.getUTCMonth()] } ${ pad(
        newDate.getUTCDate(),
        2
      ) }, ${ newDate.getUTCFullYear() }`
    : date
}

exports.getDateCalendarFormat = date => {
  const newDate = new Date(date)
  return newDate ? `${ newDate.getUTCMonth() + 1 }/${ newDate.getUTCDate() }/${ newDate.getUTCFullYear() }` : date
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

const pad = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
