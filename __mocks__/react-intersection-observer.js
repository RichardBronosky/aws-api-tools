import React from 'react'

// __mocks__/react-intersection-observer.js
export const InView = ({ children }) => React.createElement(
  'div',
  { ref: null, inView: true },
  children
)
