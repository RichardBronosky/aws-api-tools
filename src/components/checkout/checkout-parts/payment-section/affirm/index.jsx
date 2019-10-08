import React from 'react'
import AffirmButton from './affirm-button'
import { getAffirmBody } from '../../../../../lib/helpers/checkout/payment-section/affirm'

export default class AffirmButtonWrapper extends React.Component {
  state = {
    affirmLoaded: false,
  }

  affirmFunc = (l, g, m, e, a, f, b) => {
    var d,
      c = l[m] || {},
      h = document.createElement(f),
      n = document.getElementsByTagName(f)[0],
      k = function(a, b, c) {
        return function() {
          a[b]._.push([c, arguments])
        }
      }
    c[e] = k(c, e, 'set')
    d = c[e]
    c[a] = {}
    c[a]._ = []
    d._ = []
    c[a][b] = k(c, a, b)
    a = 0
    for (b = 'set add save post open empty reset on off trigger ready setProduct'.split(' '); a < b.length; a++)
      d[b[a]] = k(c, e, b[a])
    a = 0
    for (b = ['get', 'token', 'url', 'items']; a < b.length; a++) d[b[a]] = function() {}
    h.async = !0
    h.src = g[f]
    n.parentNode.insertBefore(h, n)
    delete g[f]
    d(g)
    l[m] = c
    this.setState({ affirmLoaded: true })
  }

  affirmClick = () => {
    affirm.checkout(getAffirmBody())
    affirm.checkout.open()
  }

  render() {
    const _affirm_config = {
      public_api_key: process.env.GATSBY_AFFIRM_API_KEY,
      script: `${ process.env.GATSBY_AFFIRM_URL }/js/v2/affirm.js`,
    }
    return (
      <AffirmButton
        affirmLoaded={ this.state.affirmLoaded }
        affirmFunc={ this.affirmFunc }
        affirm_config={ _affirm_config }
        affirmClick={ this.affirmClick }
      />
    )
  }
}
