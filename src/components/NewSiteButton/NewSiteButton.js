import React from 'react'
import plusImage from '../../assets/images/plus.png';
function NewSiteButton(props) {
    const onClick = props.onClick
    const className = props.className
  return (
    <button  className={className} onClick={onClick} > 
    
    <img src={plusImage} alt="Icon" style={{ marginRight: '16px' }} />
   New site </button >
  )
}

export default NewSiteButton