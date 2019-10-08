import React from 'react'
import { connectCurrentRefinements } from 'react-instantsearch-dom'
import ConnectedClearRefinements from './ConnectedClearRefinements'
import { slugify } from '../../../lib/helpers/string-helper'
import { refinementInPath, removeRefinementPath } from '../../../lib/helpers/search'
import '../../../assets/css/components/search/connectors/current-refinements.sass'
import RTGLink from '../../shared/link'

export default connectCurrentRefinements(({ items, canRefine, pathname }) => {
  return (
    <>
      { canRefine && items && (
        <div
          className="current-refinements"
          role="region"
          aria-label="Applied Facets"
          aria-describedby="appliedFacetsInfo"
          tabIndex="-1"
        >
          <span id="appliedFacetsInfo" className="hide508">{ `${ items.length + 1 } Applied Facets` }</span>

          { items.map((item, index) => (
            <ul key={ index }>
              { item.items.map(nest => (
                <li key={ nest.label }>
                  { (refinementInPath(slugify(nest.label.toLowerCase()), item.attribute) && (
                    <RTGLink
                      data={ {
                        slug: removeRefinementPath(pathname, slugify(nest.label.toLowerCase())),
                        category: 'plp',
                        action: 'facet remove',
                        label: `${ item.attribute }, ${ nest.label }`,
                      } }
                      className="refinement"
                      aria-label={ `Remove ${ nest.label } filter` }
                    >
                      { `${ nest.label }` }
                      <span className="refinement-remove" />
                    </RTGLink>
                  )) || <div className="refinement">{ `${ nest.label }` }</div> }
                </li>
              )) }
            </ul>
          )) }
          <ConnectedClearRefinements />
        </div>
      ) }
    </>
  )
})
