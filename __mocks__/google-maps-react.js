import React from 'react'

export const Map = ({ children }) => (
  <div>{ children }</div>
)

export const Marker = () => (
  <div />
)

export const InfoWindow = ({ children }) => (
  <div>{ children }</div>
)

export const GoogleApiWrapper = () => {
  return function(component) {
    component.defaultProps = {
      apiKey: 1
    }
    return component
  }
}
