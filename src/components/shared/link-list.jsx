import React from 'react'
import RTGLink from '../shared/link'
import '../../assets/css/components/shared/link-list.sass'

export default ({ data, category }) => (
  <div className="link-list">
    <ul>
      { data.links &&
        data.links.map(link => (
          <li key={ link.id }>
            <RTGLink
              data={ link }
              category={ category }
              action="link click"
              label={ link.displayText ? link.displayText : link.text }
            />
          </li>
        )) }
    </ul>
  </div>
)
