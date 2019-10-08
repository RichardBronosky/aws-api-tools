import React from 'react'
import renderer from 'react-test-renderer'
import HTML from './html'

describe('HTML', () => {
  const testProps = {
    htmlAttributes: { test1: 'html_attribute' },
    headComponents: [<div key="head_comps">test head comp</div>],
    bodyAttributes: { test2: 'body_attribute' },
    preBodyComponents: [<div key="pre_body">test pre pody</div>],
    body: 'test_body',
    postBodyComponents: [<div key="post_body">test post pody</div>],
  }

  it('renders correctly', () => {
    const tree = renderer.create(<HTML { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
