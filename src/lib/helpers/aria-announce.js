const formatMsg = msg => {
  return '<div aria-live="assertive" aria-atomic="true">' + msg + '</div>'
}

export const taskDone = (fn, time, id) => {
  let timers = {}
  if (typeof fn == 'function') {
    if (timers[id]) clearTimeout(timers[id])
    timers[id] = setTimeout(fn, time)
  }
}

export const announce = (msg, form, ele, delay) => {
  if (typeof ele == 'object') {
    msg += ele.innerText.replace(/\n/g, ' ')
  }
  if (document) {
    document.getElementById('aria-announce').innerHTML = ''
    taskDone(
      () => {
        document.getElementById('aria-announce').innerHTML = formatMsg(msg)
      },
      delay || 500,
      'announceMessage'
    )
    if (form) {
      taskDone(
        () => {
          form.querySelectorAll('[aria-invalid="true"]')[0].focus()
        },
        1000,
        'focusElement'
      )
    }
  }
}
