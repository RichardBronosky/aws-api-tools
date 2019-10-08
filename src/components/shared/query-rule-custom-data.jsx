import React from 'react'
import { QueryRuleCustomData } from 'react-instantsearch-dom'

export default () => (
  <QueryRuleCustomData
    transformItems={ items => {
      const match = items.find(dataOut => Boolean(dataOut.redirect_url))
      if (match && match.redirect_url) {
        typeof window !== 'undefined' && (window.location = match.redirect_url)
      }
      return []
    } }
  >
    { () => null }
  </QueryRuleCustomData>
)
