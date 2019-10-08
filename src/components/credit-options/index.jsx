import React from 'react'
import CreditOptions from './options'
import { getFinancePlans } from '../../lib/helpers/finance'
import { fetchCreditPostback } from '../../lib/services/credit'
import { announce, taskDone } from '../../lib/helpers/aria-announce'

export default class CreditOptionsWrapper extends React.Component {
  state = {
    promoModalOpen: false,
    account: '',
    postbackRefId: null,
    accountError: null,
  }

  componentDidMount() {
    fetchCreditPostback().then(data => this.setState({ postbackRefId: data.postbackRefId }))
  }

  accountSubmit = () => {
    const accountNumber = /^\b(?:6034\d{2}|601919)\b/
    const errorMsg = 'The Rooms To Go account number you entered is not valid.'
    if (accountNumber.test(this.state.account)) {
      window.open(process.env.GATSBY_SYNCHRONY_ACCOUNT_URL)
    } else {
      this.setState({
        accountError: errorMsg,
      })
      announce(errorMsg)
      try {
        const ele = document.getElementById('accountNumber')
        ele.setAttribute('aria-invalid', 'true')
        ele.setAttribute('aria-describedby', 'aria-announce')
        ele.focus()
      } catch (e) {
        return
      }
    }
  }

  onKeyDown = event => {
    let code = event.keyCode || event.which
    if (code === 13) {
      this.accountSubmit()
    }
  }

  setModalOpen = modalOpen => this.setState({ promoModalOpen: modalOpen })

  setAccount = account => {
    this.setState({ account, accountError: null })
    try {
      const ele = document.getElementById('accountNumber')
      ele.removeAttribute('aria-invalid')
      ele.removeAttribute('aria-describedby')
    } catch (e) {}
  }

  render() {
    const { promoModalOpen, postbackRefId, accountError } = this.state
    const financePlans = getFinancePlans(null, null, true)
    const financePlan = financePlans[0]
    let creditEndsDate = financePlan.creditEndsDate.substr(0, 10)
    const newEndDate = new Date(creditEndsDate).setHours(new Date(creditEndsDate).getHours() + 6)
    return (
      <CreditOptions
        promoModalOpen={ promoModalOpen }
        postbackRefId={ postbackRefId }
        accountError={ accountError }
        financePlan={ financePlan }
        endDate={ newEndDate }
        onKeyDown={ this.onKeyDown }
        setModalOpen={ this.setModalOpen }
        accountSubmit={ this.accountSubmit }
        setAccount={ this.setAccount }
      />
    )
  }
}
