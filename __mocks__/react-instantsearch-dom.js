import React from 'react'

export const InstantSearch = ({ children }) => <div>{ children }{console.log(children)}</div>

export const QueryRuleCustomData = ({ children }) => <div>{ children }</div>

export const connectSearchBox = () => <div>fake search box</div>

export const connectRefinementList = () => <div>fake refinement list</div>

export const connectCurrentRefinements = () => <div>fake current refinements</div>

export const connectSortBy = () => <div>fake sort by</div>

export const connectInfiniteHits = () => <div>fake infinite hits</div>

export const connectHits = () => <div>fake hits</div>

export const connectPagination = () => <div>fake pagination</div>

export const connectStats = () => <div>fake stats</div>
