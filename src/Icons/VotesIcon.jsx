import React from 'react'

const VotesIcon = ({active}) => {
    const iconStyle = active ? "#3c57a6" :"#FFFFFF";
  return (
    <div><svg width="24" height="24" viewBox="0 0 24 24" fill={iconStyle} xmlns="http://www.w3.org/2000/svg">
<path d="M16 20V13H20V20H16ZM10 20V4H14V20H10ZM4 20V9H8V20H4Z" fill={iconStyle}/>
</svg>
</div>
  )
}

export default VotesIcon