import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get("https://app.15may.club/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.data)
      });
  }, []);



  return (
    <div className="w-full flex justify-between items-center relative">
      <div className='flex items-center gap-0.5'>
        {data.imagePath ? (
          <img src={data.imagePath??null} className='w-4 md:w-10 md:h-10 h-4 rounded-full' />
        ) : (
          <span className='w-4 md:w-10 h-4 md:h-10 bg-gray-200 rounded-full' />
        )}
        <div className='flex flex-col gap-0.5'>
          <span className='text-[12px] md:text-2xl font-bold text-one'>{data.name || "no name"}</span>
        </div>
      </div>

      <div className='flex items-center gap-0.5'>
       

        <button onClick={() => navigate('/admin/information')}>
          <IoPersonCircleSharp className='text-[12px] md:text-2xl text-one' />
        </button>

      </div>
 


    </div>
  );
}

export default AdminNavbar;
