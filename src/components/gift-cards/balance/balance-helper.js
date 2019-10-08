import { balanceInquiry } from '@services/gift-card'
import { announce } from '@helpers/aria-announce'

export const submitGC = async (e, cardNumber, pin, setError, setLoading, setBalance) => {
  e.preventDefault()
  setLoading(true)
  const valid = validateCardNumbers(cardNumber, pin)
  if (valid) {
    let data
    try {
      data = await balanceInquiry({
        cardNumber,
        pin,
      })
    } catch (err) {
      const techDetails = err && err.response && err.response.data && err.response.data.error && err.response.data.error
      if (techDetails) {
        if (techDetails.includes('Account closed')) {
          submitErr(setError, '*This account has been closed.')
        }
      } else {
        submitErr(setError)
      }
    }
    if (data && data.giftCardBalance) {
      setBalance(data.giftCardBalance)
      setError(false)
      announce(`Form Submitted: Your card has a balance of ${ data.giftCardBalance }`)
    } else {
      submitErr(setError, '*The card number or pin entered are invalid. Please verify and try again.')
    }
  } else {
    submitErr(setError, '*The card number or pin entered are invalid. Please verify and try again.')
  }
  setLoading(false)
}

export const submitErr = (setError, error) => {
  let err = error || '*We were unable to find the card entered. Please verify the card number and pin and try again.'
  announce('Form Submitted: ' + err)
  setError(err)
}

export const validateCardNumbers = (number, pin) => {
  var reNum = /^[0-9]{16}/
  var rePin = /^[0-9]{8}/
  return reNum.test(String(number).toLowerCase()) && rePin.test(String(pin).toLowerCase())
}
