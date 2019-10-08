import React from 'react'
import classNames from 'classnames'
import { connectRefinementList } from 'react-instantsearch-dom'
import { titleCase, slugify, isWholeWordInStr } from '../../../lib/helpers/string-helper'
import { seoRelativeValue, refinementPath, removeRefinementPath } from '../../../lib/helpers/search'
import '../../../assets/css/components/search/connectors/refinement-list.sass'
import RTGLink from '../../shared/link'
import arrowDown from '../../../assets/images/icons8-chevron-down-24.png'
import arrowUp from '../../../assets/images/icons8-chevron-up-24.png'

export default connectRefinementList(({ items, attribute, activeFilter, displayActiveFilter, pathname }) => {
  const splitters = [' ', ',', '-']
  const attributeLabel =
    !attribute.includes('size') && attribute.indexOf('_family') !== -1
      ? attribute.substring(0, attribute.indexOf('_family'))
      : titleCase(attribute.split('_').join(' '))
  const uniqueId = `${ attributeLabel.replace(/ /g, '').toLowerCase() }Dropdown`

  const handleEscape = (attribute, e) => {
    if (e.key == 'Escape') {
      displayActiveFilter(attribute, e)
    }
    return
  }

  if (items.length > 0) {
    return (
      <li className="dropdown">
        <button
          className="dropbtn cell small-3 large-4"
          onClick={ displayActiveFilter.bind(this, attribute) }
          aria-expanded={ attribute === activeFilter }
          aria-controls={ uniqueId }
        >
          { titleCase(attributeLabel, splitters) }
          <div
            className={ classNames({
              active: attribute !== activeFilter,
            }) }
          >
            <img className="arrowDown" src={ arrowDown } alt="" aria-hidden="true" role="presentation" />
          </div>
          <div
            className={ classNames({
              active: attribute === activeFilter,
            }) }
          >
            <img className="arrowUp" src={ arrowUp } alt="" aria-hidden="true" role="presentation" />
          </div>
        </button>
        <div
          id={ uniqueId }
          className={ classNames('search-toggle-filter', {
            active: activeFilter === attribute,
          }) }
          onKeyDownCapture={ e => {
            handleEscape(attribute, e)
          } }
        >
          <ul className={ classNames('ais-RefinementList-list', activeFilter) }>
            { items.map(
              (item, index) =>
                !item.label.includes(',') && (
                  <li key={ index } className={ classNames('ais-RefinementList-item', activeFilter) }>
                    <RTGLink
                      data={ {
                        slug: isWholeWordInStr(pathname, slugify(item.label.toLowerCase()))
                          ? removeRefinementPath(pathname, slugify(item.label.toLowerCase()))
                          : refinementPath(pathname, item, attributeLabel.toLowerCase()),
                        rel: seoRelativeValue(attribute),
                        category: 'plp',
                        action: attributeLabel,
                        label: item.value.pop(),
                      } }
                      role="checkbox"
                      aria-checked={ item.isRefined }
                      onKey={ e => {
                        if (e.keyCode !== 32) return
                        // spacebar press
                        if (e.keyCode == 32) {
                          e.preventDefault()
                          e.target.click()
                        }
                      } }
                    >
                      <div className="ais-RefinementList-input">
                        <div
                          className={ classNames('ais-RefinementList-checkbox', activeFilter, item.label, {
                            'selected checked': item.isRefined,
                          }) }
                        />
                      </div>
                      <div className={ classNames('ais-RefinementList-labelText', activeFilter) }>
                        { titleCase(item.label, splitters).replace(/,/g, ', ') }
                      </div>
                    </RTGLink>
                  </li>
                )
            ) }
          </ul>
        </div>
      </li>
    )
  }
  return null
})
