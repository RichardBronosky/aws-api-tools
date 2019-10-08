import React from 'react'
import '../../assets/css/components/search/search-view-switcher.sass'
import grid2 from '../../assets/images/icons8-grid-2-filled-50.png'
import grid4 from '../../assets/images/icons8-grid-view-filled-50.png'
import grid4blue from '../../assets/images/icons8-grid-view-filled-50-blue.png'
import grid2blue from '../../assets/images/icons8-grid-2-filled-50-blue.png'

export default ({ gridWidth, setGridWidth, productType }) => (
  <div className="search-view-switcher">
    <div className="view-label">View:</div>
    { productType !== 'room' && (
      <button value="Grid View 4-Wide" onClick={ () => setGridWidth(4) } aria-pressed={ gridWidth === 4 }>
        { gridWidth === 4 && (
          <div>
            <img className="grid4 grid-switcher" src={ grid4blue } alt="View 4 Products Per Row" />
          </div>
        ) }
        { gridWidth === 2 && (
          <div>
            <img className="grid4 grid-switcher" src={ grid4 } alt="View 4 Products Per Row" />
          </div>
        ) }
      </button>
    ) }
    <button value="Grid View 2-Wide" onClick={ () => setGridWidth(2) } aria-pressed={ gridWidth === 2 }>
      { gridWidth === 2 && (
        <div>
          <img className="grid2 grid-switcher" src={ grid2blue } alt="View 2 Products Per Row" />
        </div>
      ) }
      { gridWidth === 4 && (
        <div>
          <img className="grid2 grid-switcher" src={ grid2 } alt="View 2 Products Per Row" />
        </div>
      ) }
    </button>
  </div>
)
