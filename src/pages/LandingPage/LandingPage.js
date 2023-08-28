import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <>
      <div className='nav-bar'>
        <div className="row">
          <div className="col-sm-8">
            <h4 className='figmalio'> Figmafolio</h4>
          </div>
          <div className="col-sm-4 d-flex justify-content-end">
            <button className='btn-go-to-app' >Go to app</button>
            <button className='btn-start-for-free'>Get started</button>
          </div>
        </div>
      </div>
      <div className='container main-container'>

        <div className='container header-container'>
          <h2 className='header_one'> Build your portfolio easily using Figma prototypes</h2>
          <h3 className='header_two'>No coding required</h3>
        </div>

        <div className='row btn_column'>
          <div className='col-6 text-end'>
            <button className='btn-learn-more' >Learn more</button>
          </div>
          <div className='col-6'>
            <button className='btn-start-for-free'>Start for free</button>
          </div>
        </div>
        <div className='container'>
          <h3 className='content_one'> Instantly turn your Figma prototypes into an impressive online portfolio with just a few clicks.</h3>
          <h4 className='content_two'> Simply connect your Figma files and figmafolio does the rest.. Update your projects in real-time by iterating in Figma. It's the fastest way for you to get your UX work online and start promoting your skills, without the hassle of rebuilding your website and prototypes separately. Skip redoing all that work. Go from Figma to portfolio instantly and let your UX talents shine</h4>
        </div>
      </div>
    </>
  )
}