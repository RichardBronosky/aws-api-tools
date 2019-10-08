import React, { useState } from 'react'
import RTGLink from '../shared/link'
import { contentfulImage } from '../../lib/helpers/contentful'
import { emailSubscribe } from '../../lib/helpers/email'
import loaderLight from '../../assets/images/loader-light.svg'
import paymentLogos from '../../assets/images/paymentLogos.png'
import '../../assets/css/global/footer.sass'
import { getFinancePlans } from '@helpers/finance'
import InfoModal from '@shared/info-modal'
import { hasIn } from 'lodash'

const FooterComponent = ({ checkout, submitted, error, fields, email, zip, loading, setState, activeMenu, node, success }) => {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const highestFinancePlanMsg = getFinancePlans()[0].promoMessage
  return (
    <footer>
    { !checkout && (
      <div className="grid-container">
        <div className="bottom-row ">
          <div>
            <div className="left">
              <div className="grid-x">
                <div className="small-12 medium-12 large-9 grid-x">
                  <p className="cc-text">
                    <img
                      src={ contentfulImage(`${ process.env.GATSBY_S3_IMAGE_URL }rtg-cc.png`) }
                      className="cc-img"
                      alt="Rooms To Go Credit"
                    />                    
                    With a Rooms To Go Credit Card, you can take advantage of exclusive financing offers in your area.{ ' ' }
                  </p>
                </div>
                <div className="cell small-12 medium-12 large-3 grid-x">

                <RTGLink
                  target="_blank"
                  data={ {
                    url: process.env.GATSBY_SYNCHRONY_URL,
                    title: 'Rooms To Go Credit Options',
                    displayText: 'Apply Now',
                    id: 'apply-now',
                    category: 'credit-card',
                    action: 'apply-now',
                    label: 'footer',
                  } }
                  aria-label="Learn More about Rooms To Go Credit Cards"
                  className="credit-learn-more blue-action-btn small-12"
                >
                  Apply Now
                </RTGLink>                 
                <button
                  gtm-category={ 'credit-card' }
                  gtm-action={ 'learn more' }
                  gtm-label={ 'footer' }
                  className={ 'info-modal credit-learn-more link' }
                  onClick={ () => setShouldShowModal(true) }
                  aria-label="Learn More about Rooms To Go Credit Cards"
                >
                  Learn More
                </button>   
                { shouldShowModal && hasIn(highestFinancePlanMsg, 'childMarkdownRemark.html') && 
                  <InfoModal
                    label={ 'Rooms To Go Credit Options' }
                    mdlClass={ 'rtg-credit-modal' }
                    shouldShowModal={shouldShowModal}
                    closeModal={ () => setShouldShowModal(false) }
                  >
                    <div dangerouslySetInnerHTML={ { __html: highestFinancePlanMsg.childMarkdownRemark.html } } />
                  </InfoModal>
                } 
                </div>
              </div>
            </div>
            <div className="right">
              <div className="email-label">Enter email and zip code to receive special offers and more</div>
              <form>
                { submitted && <p className="success">{ success }</p> }
                { error && <p className="error">{ error }</p> }
                <div className="email-container">
                  <label className="signup-email-label" htmlFor="signup_email">
                    Email Address:
                  </label>
                  <input
                    aria-required="true"
                    aria-invalid={ fields[0] }
                    type="text"
                    className="signup-email"
                    id="signup_email"
                    name="email"
                    value={ email }
                    onChange={ e => setState({ email: e.target.value, error: null, submitted: false }) }
                  />
                </div>
                <div className="zip-container">
                  <label className="signup-zip-label" htmlFor="zip">
                    Zip Code:
                  </label>
                  <input
                    aria-required="true"
                    aria-invalid={ fields[1] }
                    type="text"
                    className="signup-zip"
                    id="zip"
                    name="zip"
                    value={ zip }
                    onChange={ e => setState({ zip: e.target.value, error: null, submitted: false }) }
                  />
                </div>
                <button
                  value="Sign Up"
                  name="signup_btn"
                  className="signup-btn"
                  id="signup-btn"
                  gtm-category="footer"
                  gtm-action="email signup"
                  onClick={ e => emailSubscribe(e, email, zip, error, setState) }
                >
                  { loading ? <img className="loader" alt="Sign Up" src={ loaderLight } /> : 'Sign Up' }
                </button>
              </form>
            </div>
          </div>
        </div>
        <div>
          <nav aria-label="Footer Links">
            { node.linkLists.map(linkList => (
              <div className="menu-col" key={ linkList.id }>
                <div className="heading">
                  { linkList.headingLink.displayText ? linkList.headingLink.displayText : linkList.headingLink.text }
                  <i className={ activeMenu === linkList.headingLink.text ? 'menu-active' : 'menu-inactive' } />
                </div>
                <div className={ (activeMenu === linkList.headingLink.text ? 'active' : '') + ' sub-menu' }>
                  { linkList.links.map(link => (
                    <RTGLink
                      data={ link }
                      key={ link.id }
                      category="footer"
                      action="link click"
                      label={ link.displayText ? link.displayText : link.text }
                      noAriaLabel="true"
                    />
                  )) }
                </div>
              </div>
            )) }
            <div
              className="menu-col"
              dangerouslySetInnerHTML={ {
                __html: node.contact.childMarkdownRemark.html,
              } }
            />
          </nav>
        </div>
        <div className="social-media grid-container">
          <div className="grid-x">
            <div className="social-icons small-12  large-4">
              <RTGLink
                target="_blank"
                rel="noopener"
                className="icon"
                data={ {
                  url: 'https://www.facebook.com/roomstogo/',
                  id: 'facebook-icon',
                  category: 'footer',
                  action: 'social click',
                  label: 'facebook',
                } }
              >
                <img
                  className="fb"
                  alt="Facebook (opens in new window)"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2023.94%2051.86%22%20fill%3D%22%230854A0%22%3E%3Ctitle%3Eicon-social-fb%3C%2Ftitle%3E%3Cg%20id%3D%22Layer%5f2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Objects%22%3E%3Cpath%20d%3D%22M5.43%2C51.86H15.87V25.71h7.29L23.94%2C17H15.87V12c0-2.07.42-2.88%2C2.41-2.88h5.66V0H16.71C8.93%2C0%2C5.43%2C3.42%2C5.43%2C10v7H0v8.87H5.43Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
              </RTGLink>
              <RTGLink
                target="_blank"
                rel="noopener"
                className="icon"
                data={ {
                  url: 'https://twitter.com/RoomsToGo/',
                  id: 'twitter-icon',
                  category: 'footer',
                  action: 'social click',
                  label: 'twitter',
                } }
              >
                <img
                  alt="Twitter (opens in new window)"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2045.71%2037.15%22%20fill%3D%22%230854A0%22%3E%3Ctitle%3Eicon-social-tw%3C%2Ftitle%3E%3Cg%20id%3D%22Layer%5f2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Objects%22%3E%3Cpath%20d%3D%22M0%2C32.93a26.56%2C26.56%2C0%2C0%2C0%2C14.38%2C4.22c17.41%2C0%2C27.24-14.71%2C26.65-27.9A19.1%2C19.1%2C0%2C0%2C0%2C45.71%2C4.4a18.7%2C18.7%2C0%2C0%2C1-5.39%2C1.47A9.37%2C9.37%2C0%2C0%2C0%2C44.45.68a18.71%2C18.71%2C0%2C0%2C1-6%2C2.28%2C9.38%2C9.38%2C0%2C0%2C0-16%2C8.55A26.64%2C26.64%2C0%2C0%2C1%2C3.18%2C1.72%2C9.39%2C9.39%2C0%2C0%2C0%2C6.09%2C14.24a9.25%2C9.25%2C0%2C0%2C1-4.25-1.18%2C9.39%2C9.39%2C0%2C0%2C0%2C7.52%2C9.32%2C9.42%2C9.42%2C0%2C0%2C1-4.24.16%2C9.39%2C9.39%2C0%2C0%2C0%2C8.76%2C6.51A18.82%2C18.82%2C0%2C0%2C1%2C0%2C32.93Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
              </RTGLink>
              <RTGLink
                target="_blank"
                rel="noopener"
                className="icon"
                data={ {
                  url: 'https://www.instagram.com/roomstogo/',
                  id: 'instagram-icon',
                  category: 'footer',
                  action: 'social click',
                  label: 'instagram',
                } }
              >
                <img
                  alt="Instagram (opens in new window)"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2047.04%2047.04%22%20fill%3D%22%230854A0%22%3E%3Ctitle%3Eicon-social-ins%3C%2Ftitle%3E%3Cg%20id%3D%22Layer%5f2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Objects%22%3E%3Cpath%20d%3D%22M23.52%2C4.24c6.28%2C0%2C7%2C0%2C9.5.13a13.2%2C13.2%2C0%2C0%2C1%2C4.37.81A7.43%2C7.43%2C0%2C0%2C1%2C40.1%2C6.94a7.28%2C7.28%2C0%2C0%2C1%2C1.75%2C2.71A12.68%2C12.68%2C0%2C0%2C1%2C42.66%2C14c.12%2C2.48.14%2C3.22.14%2C9.5s0%2C7-.14%2C9.5a12.68%2C12.68%2C0%2C0%2C1-.81%2C4.37%2C7.67%2C7.67%2C0%2C0%2C1-4.46%2C4.46%2C12.68%2C12.68%2C0%2C0%2C1-4.37.81c-2.48.12-3.22.14-9.5.14s-7%2C0-9.5-.14a12.68%2C12.68%2C0%2C0%2C1-4.37-.81A7.28%2C7.28%2C0%2C0%2C1%2C6.94%2C40.1a7.43%2C7.43%2C0%2C0%2C1-1.76-2.71A13.2%2C13.2%2C0%2C0%2C1%2C4.37%2C33c-.11-2.48-.13-3.22-.13-9.5s0-7%2C.13-9.5a13.2%2C13.2%2C0%2C0%2C1%2C.81-4.37A7.77%2C7.77%2C0%2C0%2C1%2C9.65%2C5.18%2C13.2%2C13.2%2C0%2C0%2C1%2C14%2C4.37c2.48-.11%2C3.22-.13%2C9.5-.13m0-4.24c-6.39%2C0-7.19%2C0-9.7.14A17.51%2C17.51%2C0%2C0%2C0%2C8.11%2C1.23%2C11.69%2C11.69%2C0%2C0%2C0%2C4%2C4%2C11.69%2C11.69%2C0%2C0%2C0%2C1.23%2C8.11%2C17.51%2C17.51%2C0%2C0%2C0%2C.14%2C13.82C0%2C16.33%2C0%2C17.13%2C0%2C23.52s0%2C7.19.14%2C9.7a17.51%2C17.51%2C0%2C0%2C0%2C1.09%2C5.71A11.69%2C11.69%2C0%2C0%2C0%2C4%2C43.09%2C11.53%2C11.53%2C0%2C0%2C0%2C8.11%2C45.8a17.22%2C17.22%2C0%2C0%2C0%2C5.71%2C1.1c2.51.11%2C3.31.14%2C9.7.14s7.19%2C0%2C9.7-.14a17.22%2C17.22%2C0%2C0%2C0%2C5.71-1.1%2C12%2C12%2C0%2C0%2C0%2C6.87-6.87%2C17.22%2C17.22%2C0%2C0%2C0%2C1.1-5.71c.11-2.51.14-3.31.14-9.7s0-7.19-.14-9.7a17.22%2C17.22%2C0%2C0%2C0-1.1-5.71A11.53%2C11.53%2C0%2C0%2C0%2C43.09%2C4a11.69%2C11.69%2C0%2C0%2C0-4.16-2.72A17.51%2C17.51%2C0%2C0%2C0%2C33.22.14C30.71%2C0%2C29.91%2C0%2C23.52%2C0%22%2F%3E%3Cpath%20d%3D%22M23.52%2C11.44A12.08%2C12.08%2C0%2C1%2C0%2C35.6%2C23.52%2C12.08%2C12.08%2C0%2C0%2C0%2C23.52%2C11.44m0%2C19.92a7.84%2C7.84%2C0%2C1%2C1%2C7.84-7.84%2C7.84%2C7.84%2C0%2C0%2C1-7.84%2C7.84%22%2F%3E%3Cpath%20d%3D%22M38.9%2C11a2.83%2C2.83%2C0%2C1%2C1-2.83-2.82A2.83%2C2.83%2C0%2C0%2C1%2C38.9%2C11%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
              </RTGLink>
              <RTGLink
                className="icon pin"
                rel="noopener"
                target="_blank"
                data={ {
                  url: 'https://www.pinterest.com/roomstogo/',
                  id: 'pintrest-icon',
                  category: 'footer',
                  action: 'social click',
                  label: 'pintrest',
                } }
              >
                <img
                  alt="Pintrest (opens in new window)"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2039.44%2050.95%22%20fill%3D%22%230854A0%22%3E%3Ctitle%3Eicon-social-pin%3C%2Ftitle%3E%3Cg%20id%3D%22Layer%5f2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Objects%22%3E%3Cpath%20d%3D%22M6%2C29.46a1%2C1%2C0%2C0%2C0%2C1.47-.73c.13-.51.45-1.81.6-2.35a1.42%2C1.42%2C0%2C0%2C0-.43-1.63A8.48%2C8.48%2C0%2C0%2C1%2C5.7%2C19c0-7.4%2C5.54-14%2C14.41-14C28%2C5%2C32.29%2C9.79%2C32.29%2C16.21c0%2C8.44-3.74%2C15.56-9.28%2C15.56a4.53%2C4.53%2C0%2C0%2C1-4.62-5.64C19.27%2C22.42%2C21%2C18.42%2C21%2C15.75c0-2.4-1.28-4.4-3.94-4.4-3.13%2C0-5.65%2C3.24-5.65%2C7.58a11.2%2C11.2%2C0%2C0%2C0%2C.94%2C4.63L8.55%2C39.5C7.43%2C44.24%2C8.38%2C50%2C8.47%2C50.62a.39.39%2C0%2C0%2C0%2C.69.17c.29-.37%2C4-5%2C5.28-9.57.36-1.31%2C2.06-8%2C2.06-8%2C1%2C1.94%2C4%2C3.65%2C7.15%2C3.65%2C9.41%2C0%2C15.79-8.58%2C15.79-20.06C39.44%2C8.08%2C32.09%2C0%2C20.91%2C0%2C7%2C0%2C0%2C10%2C0%2C18.28%2C0%2C23.31%2C1.91%2C27.79%2C6%2C29.46Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
              </RTGLink>
              <RTGLink
                target="_blank"
                rel="noopener"
                className="icon"
                data={ {
                  url: 'https://www.youtube.com/channel/UCd77CqGAnGsyDD-lFFkyrNw',
                  id: 'youtube-icon',
                  category: 'footer',
                  action: 'social click',
                  label: 'youtube',
                } }
              >
                <img
                  alt="YouTube (opens in new window)"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2044.38%2051.22%22%20fill%3D%22%230854A0%22%3E%3Ctitle%3Eicon-social-youtube%3C%2Ftitle%3E%3Cg%20id%3D%22Layer%5f2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Objects%22%3E%3Cpath%20d%3D%22M28.67%2C20a4.3%2C4.3%2C0%2C0%2C0%2C3.14-1.83v1.62h2.71V5.19H31.81V16.25c-.33.42-1.07%2C1.09-1.6%2C1.09s-.72-.39-.72-1V5.18H26.78V17.37C26.78%2C18.81%2C27.22%2C20%2C28.67%2C20Z%22%2F%3E%3Cpath%20d%3D%22M16.61%2C16.13c0%2C2.57%2C1.34%2C3.9%2C4%2C3.9a3.71%2C3.71%2C0%2C0%2C0%2C3.9-3.9V9a3.8%2C3.8%2C0%2C0%2C0-3.9-3.91%2C3.72%2C3.72%2C0%2C0%2C0-4%2C3.91ZM19.4%2C9.22c0-.8.37-1.39%2C1.13-1.39s1.19.58%2C1.19%2C1.39V16c0%2C.79-.41%2C1.37-1.14%2C1.37A1.22%2C1.22%2C0%2C0%2C1%2C19.4%2C16Z%22%2F%3E%3Cpolygon%20points%3D%2210.14%2019.77%2013.2%2019.77%2013.2%2011.75%2016.75%200%2013.65%200%2011.69%207.9%209.58%200%206.51%200%2010.14%2011.75%2010.14%2019.77%22%2F%3E%3Cpath%20d%3D%22M38.17%2C23.08h-32A6.22%2C6.22%2C0%2C0%2C0%2C0%2C29.3V45a6.22%2C6.22%2C0%2C0%2C0%2C6.21%2C6.22h32A6.22%2C6.22%2C0%2C0%2C0%2C44.38%2C45V29.3A6.22%2C6.22%2C0%2C0%2C0%2C38.17%2C23.08ZM10.47%2C46.56H7.57V30.47h-3V27.74h8.92v2.73h-3Zm10.34%2C0H18.23V45a5.44%2C5.44%2C0%2C0%2C1-1.48%2C1.29c-1.39.8-3.3.78-3.3-2V32.68H16V43.32c0%2C.56.13.94.68.94s1.21-.65%2C1.52-1V32.68h2.58Zm9.94-2.87c0%2C1.71-.64%2C3.05-2.36%2C3.05a3%2C3%2C0%2C0%2C1-2.45-1.24v1.06H23.33V27.74h2.61V33.8a3.09%2C3.09%2C0%2C0%2C1%2C2.29-1.3c1.89%2C0%2C2.52%2C1.6%2C2.52%2C3.48ZM40.29%2C40H35.36v2.62c0%2C1%2C.08%2C1.94%2C1.12%2C1.94s1.16-.74%2C1.16-1.94v-1h2.65v1c0%2C2.67-1.15%2C4.29-3.87%2C4.29-2.46%2C0-3.72-1.8-3.72-4.29V36.41a3.81%2C3.81%2C0%2C0%2C1%2C3.92-4.08c2.48%2C0%2C3.67%2C1.57%2C3.67%2C4.08Z%22%2F%3E%3Cpath%20d%3D%22M36.51%2C34.76c-1%2C0-1.15.67-1.15%2C1.63v1.4h2.28v-1.4C37.64%2C35.45%2C37.44%2C34.76%2C36.51%2C34.76Z%22%2F%3E%3Cpath%20d%3D%22M26.47%2C34.84a2%2C2%2C0%2C0%2C0-.53.43v8.65a2.15%2C2.15%2C0%2C0%2C0%2C.61.49%2C1.1%2C1.1%2C0%2C0%2C0%2C1.32-.14%2C1.62%2C1.62%2C0%2C0%2C0%2C.22-1V36.14a1.78%2C1.78%2C0%2C0%2C0-.27-1.07A1.09%2C1.09%2C0%2C0%2C0%2C26.47%2C34.84Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                />
              </RTGLink>
            </div>
            <div className="get-app small-12  large-4">
              <RTGLink
                className="icon"
                data={ {
                  url: 'https://www.roomstogocoupons.com/',
                  displayText: 'Get the Rooms To Go Coupon App',
                  id: 'coupon-app',
                  category: 'footer',
                  action: 'app download',
                  label: 'app download',
                } }
              >
                <img
                  alt="Get the Rooms To Go Coupon App"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 86' fill='rgb%28255,255,255%29'%3E%3Ctitle%3Eicon-app%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath d='M6,0A6,6,0,0,0,0,6V80a6,6,0,0,0,6,6H40a6,6,0,0,0,6-6V6a6,6,0,0,0-6-6ZM4,10H42V70H4ZM23,73a5,5,0,1,1-5,5A5,5,0,0,1,23,73Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
                />
              </RTGLink>
              <span aria-hidden="true" style={ { display: 'block' } }>
                Get the Rooms To Go Coupon App
              </span>
            </div>
            <div className="payment-methods small-12 large-4">
              <img
                className="paymentLogos"
                src={ paymentLogos }
                alt="Accepted payment types: Discover, Mastercard, Visa, Amex, Rooms to go Credit, PayPal, Affirm"
              />
            </div>
          </div>
        </div>
      </div>
    ) }
    <div className="blue-row">
      <div className="grid-container grid-margin-y">
        <div className="rtg-logo grid-x">
          <RTGLink
            className="icon pin small-3"
            data={ {
              slug: '/',
              title: 'Rooms To Go',
              category: 'footer',
              action: 'click',
              label: 'logo',
            } }
          >
            <img
              src={ `${ contentfulImage(`${ process.env.GATSBY_S3_IMAGE_URL }mobile-logo_transparent.png`) }&h=250` }
              alt="Rooms To Go"
              className="desktop"
            />
            <img
              src={ `${ contentfulImage(`${ process.env.GATSBY_S3_IMAGE_URL }mobile-logo_transparent.png`) }&h=250` }
              alt="Rooms To Go"
              className="mobile"
            />
          </RTGLink>
        </div>
        <div className="notices">
          <p className="first">
            { /* <RTGLink
              data={ node.sitemap }
              category="footer"
              action="sitemap click"
              label="sitemap"
              noAriaLabel="true"
            />
            &nbsp;&nbsp;|&nbsp;&nbsp; */ }
            <RTGLink
              data={ node.privacyPolicy }
              category="footer"
              action="privacy click"
              label="privacy policy"
              noAriaLabel="true"
            />
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <RTGLink
              data={ node.termsOfUse }
              category="footer"
              action="terms click"
              label="terms of use"
              noAriaLabel="true"
            />
          </p>
          <div className="copyright" dangerouslySetInnerHTML={ { __html: node.copyright } } />
        </div>
        <div className="logos">
          <img
            src={ `${ contentfulImage(`${ process.env.GATSBY_S3_IMAGE_URL }logo-norton_transparent.png`) }&h=250` }
            alt="Norton Secured Powered by digicert"
          />
          <img
            src={ `${ contentfulImage(`${ process.env.GATSBY_S3_IMAGE_URL }logo-bbb_transparent.png`) }&h=250` }
            alt="BBB Accredited Business A+"
          />
        </div>
      </div>
    </div>
  </footer>
  )
}

export default FooterComponent