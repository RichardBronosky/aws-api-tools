import React from 'react'
import renderer from 'react-test-renderer'
import ReactModal from 'react-modal'
import DeclineModal from '../decline-modal'

ReactModal.setAppElement('*')

describe('DeclineModal', () => {
  const testProps = {
    modalOpen: true,
    closeModal: jest.fn(),
    type: 'Test',
    loading: false,
  }

  it('renders correctly while not loading', () => {
    const tree = renderer.create(<DeclineModal { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly while loading', () => {
    const newTestProps = {
      ...testProps,
      loading: true,
    }
    const tree = renderer.create(<DeclineModal { ...newTestProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
