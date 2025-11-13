import React from 'react'
import { FaPeopleLine } from "react-icons/fa6";

const NumberIcon = ({active}) => {
    const iconStyle = active ? "#876340" :"#FFFFFF";
  return (
    <div><FaPeopleLine className={`text-2xl `} style={{ color: iconStyle }}/></div>
  )
}

export default NumberIcon