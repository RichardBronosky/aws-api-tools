import React from 'react'
import renderer from 'react-test-renderer'
import Footer from './footer'
import * as financeHelper from '@helpers/finance'
import * as emailHelper from '../../lib/helpers/email'

jest.mock('../shared/link', () => 'RTGLink')

beforeEach(() => {
  financeHelper.getFinancePlans = jest.fn(() => [{ promoMessage: "Test Promo Message" }])
})

describe('Footer', () => {
  const testProps = {
    activeMenu: '',
    email: '',
    zip: '',
    error: null,
    success: null,
    submitted: false,
    loading: false,
    fields: [false, false],
    setState: jest.fn(),
    node: {
      id: 'testid',
      linkLists: [
        {
          id: 'testlinklikstid',
          displayText: 'Test Link List',
          headingLink: {
            text: 'Test heading text',
          },
          links: [
            {
              id: 'testlinkid',
              displayText: 'Test Link',
            },
          ],
        },
      ],
      contact: {
        childMarkdownRemark: {
          html: <div>hi</div>,
        },
      },
      termsOfUse: null,
      privacyPolicy: null,
    },
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<Footer { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls setState on email input change', () => {
    const tree = renderer.create(<Footer { ...testProps } />)
    tree.root.findByProps({ className: 'signup-email' }).props.onChange({ target: { value: 'hi' } })
    expect(testProps.setState).toHaveBeenCalled()
  })

  it('calls setState on zip input change', () => {
    const tree = renderer.create(<Footer { ...testProps } />)
    tree.root.findByProps({ className: 'signup-zip' }).props.onChange({ target: { value: 'hi' } })
    expect(testProps.setState).toHaveBeenCalled()
  })

  it('calls emailSubscribe on submit click', () => {
    const tree = renderer.create(<Footer { ...testProps } />)
    emailHelper.emailSubscribe = jest.fn()
    tree.root.findByProps({ className: 'signup-btn' }).props.onClick()
    expect(emailHelper.emailSubscribe).toHaveBeenCalled()
  })
})
