import React from 'react'
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";


const NavAndSearch = ({nav ,searchQuery,setSearchQuery, like}) => {
    const navigate = useNavigate();
  return (
    <div className='mt-2'><div className="flex justify-between items-center gap-3">
        <div className="relative items-center w-1/2 ">
          <input
            placeholder="Search"
            className="w-full  h-[40px] lg:h-[48px] border-2 border-one rounded-[40px] pl-5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className='absolute right-0 top-0 h-full bg-one   rounded-r-[40px] w-10 lg:w-[50px] flex items-center justify-center'>
          <CiSearch className="  text-white  text-2xl " />
          </i>  
        </div>
  {!like&&(<button onClick={()=>navigate(nav)}
  className='bg-one flex gap-3 px-4 py-2 items-center rounded-2xl font-medium transition-transform hover:scale-95'> 
    <span className=" text-[20px] lg:text-2xl text-white">Add</span>
    <IoMdAddCircle className="text-[20px] lg:text-2xl text-white" />
  </button>)}
      </div></div>
  )
}

export default NavAndSearch