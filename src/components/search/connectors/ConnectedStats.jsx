import React from 'react'
import { connectStats } from 'react-instantsearch-dom'
import '../../../assets/css/components/search/connectors/stats.sass'
import { announce } from '../../../lib/helpers/aria-announce'

export class ConnectStats extends React.Component {
  componentDidMount() {
    const { nbHits } = this.props
    announce(nbHits.toLocaleString() + ' RESULTS')
  }

  render() {
    const { nbHits } = this.props
    return (
      <div className="ais-Stats">
        <span id="searchResultsCount" className="ais-Stats-text">
          { nbHits.toLocaleString() } RESULTS
        </span>
      </div>
    )
  }
}

export default connectStats(ConnectStats)
