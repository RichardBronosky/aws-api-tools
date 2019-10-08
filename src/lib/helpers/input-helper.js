export const keyboardBlur = e => {
  if (e.keyCode == 13 && e.shiftKey == false) {
    e.target.blur()
  }
}

export const onInputBlur = e => {
  e.stopPropagation()
}

export const onInputKeyDown = (e, _autocomplete) => {
  if (!e || e.shiftKey) return

  if (e && (e.key === 'Tab' || e.key === 'ArrowDown')) {
    const autoApi = _autocomplete

    autoApi._ignoreBlur = true

    if (autoApi.state.isOpen) {
      try {
        autoApi.refs['item-0'].focus()
      } catch (err) {}
    } else {
      return
    }

    e.preventDefault()
  }
}

export const onItemKeyDown = (e, _autocomplete) => {
  if (!e) return

  e.preventDefault()

  const el = e.target
  const autoApi = _autocomplete
  const descendant = id => {
    autoApi.refs.input.setAttribute('aria-activedescendant', id)
  }

  descendant(el.id)
  try {
    switch (e.key) {
      case 'ArrowUp':
        if (el.previousSibling) {
          el.previousSibling.focus()
        } else {
          el.parentElement.lastChild.focus()
        }
        break
      case 'ArrowDown':
        if (el.nextSibling) {
          el.nextSibling.focus()
        } else {
          el.parentElement.firstChild.focus()
        }
        break
      case 'Escape':
        autoApi._ignoreFocus = true
        autoApi.setState({
          highlightedIndex: null,
          isOpen: false,
        })
        autoApi.refs.input.select()
        descendant('')
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        autoApi._ignoreFocus = true
        autoApi.setState({
          highlightedIndex: null,
          isOpen: true,
        })
        autoApi.refs.input.select()
        descendant('')
        break
      case 'Tab':
        if (e.shiftKey && Object.is(el, el.parentElement.firstChild)) {
          autoApi.refs.input.select()
          return
        }
        if (Object.is(el, el.parentElement.lastChild)) {
          autoApi.setIgnoreBlur(false)
          autoApi.setState({
            highlightedIndex: null,
            isOpen: false,
          })
          descendant('')
          document.getElementById('phone').focus()
          return
        }
        if (e.shiftKey && el.previousSibling) {
          el.previousSibling.focus()
        }
        if (!e.shiftKey && el.nextSibling) {
          el.nextSibling.focus()
        }
        break
      case 'Enter':
        if (el.id == 'addsugnoresults') {
          el.children[0].click()
        } else {
          el.click()
        }
        descendant('')
        break
      default:
        return
    }
  } catch (e) {}
}
