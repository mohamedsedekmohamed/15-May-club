import React from 'react'

const RejectedIcon = ({active}) => {
 const iconStyle = active ? "#876340" :"#FFFFFF";
  return (
    <div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={iconStyle} xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_110_511)">
<path d="M24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12ZM4.065 18.876C4.393 19.254 4.746 19.6075 5.124 19.9365L19.9365 5.124C19.6087 4.74567 19.2543 4.39127 18.876 4.0635L4.065 18.876Z" fill={iconStyle}/>
</g>
<defs>
<clipPath id="clip0_110_511">
<rect width="24" height="24" fill={iconStyle}/>
</clipPath>
</defs>
</svg>

    </div>
  )
}
export default RejectedIcon