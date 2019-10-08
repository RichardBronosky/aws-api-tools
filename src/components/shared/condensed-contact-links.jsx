import React from 'react'
import { connect } from 'react-redux'
import RTGLink from '../shared/link'
import '../../assets/css/components/shared/condensed-contact-links.sass'

// initOpenChatButton();

// function initOpenChatButton(){
//   if(typeof(insideFrontInterface) == "undefined" || typeof(insideFrontInterface.getAvailableAssistants) == "undefined"){
//     setTimeout(initOpenChatButton, 1000);
//     return;
//   };
//   var $ = _insideGraph.jQuery; $.inside.bind("updateUsers", updateUsers); $.inside.bind("removeUsers", updateUsers); updateUsers();
// };

// function updateUsers(){
//   if(insideFrontInterface.getAvailableAssistants().length == 0){
//     console.log("hide it")
//   }else{
//     console.log("show it")
//   };
// };

const CondensedContactLinks = ({ isMobile }) => (
  <div className="cell bottom-links small-12">
    <div className="bottom-links-grid grid-x">
      <RTGLink
        data={ {
          slug: '/customer-service/common-questions',
          category: 'cart/checkout',
          action: 'FAQ click',
          label: 'FAQ',
        } }
        className="grid-y"
      >
        <img
          className="icon faq"
          alt=""
          aria-hidden="true"
          role="presentation"
          src="data:image/svg+xml;charset=utf8,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='question' class='svg-inline--fa fa-question fa-w-12' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%230053A0' d='M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z'%3E%3C/path%3E%3C/svg%3E"
        />
        FAQ
      </RTGLink>
      <RTGLink
        data={ {
          url: 'tel:18887095380',
          category: 'cart/checkout',
          action: 'Call click',
          label: 'Call',
        } }
        className="grid-y"
      >
        <img
          className="icon phone"
          alt=""
          aria-hidden="true"
          role="presentation"
          src="data:image/svg+xml;charset=utf8,%3C?xml version='1.0' ?%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg enable-background='new 0 0 50 50' height='50px' id='Layer_1' version='1.1' viewBox='0 0 50 50' width='50px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect fill='none' height='50' width='50'/%3E%3Cpath style='stroke:%230053A0' d='M30.217,35.252c0,0,4.049-2.318,5.109-2.875 c1.057-0.559,2.152-0.7,2.817-0.294c1.007,0.616,9.463,6.241,10.175,6.739c0.712,0.499,1.055,1.924,0.076,3.32 c-0.975,1.396-5.473,6.916-7.379,6.857c-1.909-0.062-9.846-0.236-24.813-15.207C1.238,18.826,1.061,10.887,1,8.978 C0.939,7.07,6.459,2.571,7.855,1.595c1.398-0.975,2.825-0.608,3.321,0.078c0.564,0.781,6.124,9.21,6.736,10.176 c0.419,0.66,0.265,1.761-0.294,2.819c-0.556,1.06-2.874,5.109-2.874,5.109s1.634,2.787,7.16,8.312 C27.431,33.615,30.217,35.252,30.217,35.252z' fill='none' stroke='%23000000' stroke-miterlimit='10' stroke-width='4'/%3E%3C/svg%3E"
        />
        { !isMobile && <>1-888-709-5380</> }
        { isMobile && <>CALL</> }
      </RTGLink>
      { /* 
      <button className="grid-y"
        onClick={ insideFrontInterface.openChatPane() }
      >
        <img
          className="icon chat"
          alt=""
          aria-hidden="true"
          role="presentation"
          src="data:image/svg+xml;charset=utf8,%3Csvg aria-hidden='true' data-prefix='far' data-icon='comments' class='svg-inline--fa fa-comments fa-w-18' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%230053A0' d='M532 386.2c27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.3 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.2 2.1 18.7 3.7 28.4 4.9C208.1 407.6 281.8 448 368 448c20.8 0 40.8-2.4 59.8-6.8C456.3 459.7 499.4 480 553 480c9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25-.4-.3-22.5-24.1-37.8-54.8zm-392.8-92.3L122.1 305c-14.1 9.1-28.5 16.3-43.1 21.4 2.7-4.7 5.4-9.7 8-14.8l15.5-31.1L77.7 256C64.2 242.6 48 220.7 48 192c0-60.7 73.3-112 160-112s160 51.3 160 112-73.3 112-160 112c-16.5 0-33-1.9-49-5.6l-19.8-4.5zM498.3 352l-24.7 24.4 15.5 31.1c2.6 5.1 5.3 10.1 8 14.8-14.6-5.1-29-12.3-43.1-21.4l-17.1-11.1-19.9 4.6c-16 3.7-32.5 5.6-49 5.6-54 0-102.2-20.1-131.3-49.7C338 339.5 416 272.9 416 192c0-3.4-.4-6.7-.7-10C479.7 196.5 528 238.8 528 288c0 28.7-16.2 50.6-29.7 64z'%3E%3C/path%3E%3C/svg%3E"
        />
        CHAT <span className="hide508">with Customer Care</span>
      </button> 
*/ }

      <RTGLink
        data={ {
          url: 'mailto:internetSalesSupport@roomstogo.com',
          category: 'cart/checkout',
          action: 'Email click',
          label: 'Email',
        } }
        className="grid-y"
      >
        <img
          className="icon email"
          alt=""
          aria-hidden="true"
          role="presentation"
          src="data:image/svg+xml;charset=utf8,%3Csvg aria-hidden='true' data-prefix='far' data-icon='envelope' class='svg-inline--fa fa-envelope fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%230053A0' d='M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z'%3E%3C/path%3E%3C/svg%3E"
        />
        EMAIL <span className="hide508">Internet Sales Support</span>
      </RTGLink>
    </div>
  </div>
)

const mapStateToProps = state => {
  return { ...state.global }
}

export default connect(
  mapStateToProps,
  null
)(CondensedContactLinks)
