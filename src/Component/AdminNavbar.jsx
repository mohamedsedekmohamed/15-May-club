import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import '../translation/i18n'
import { GrLanguage } from "react-icons/gr";

const AdminNavbar = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
    const { t, i18n } = useTranslation();

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

const handleLanguage = (event) => {
  const newLang = event.target.value;
  i18n.changeLanguage(newLang);
  localStorage.setItem('language', newLang);
  
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
};


  return (
    <div className="w-full flex justify-between items-center relative">
      <div className='flex items-center gap-0.5'>
      
          <img src={data.imagePath} alt='main pic' className='w-4 md:w-10 md:h-10 h-4 rounded-full' />
        <div className='flex flex-col gap-0.5'>
          <span className='text-[12px] md:text-2xl font-bold text-one'>{data.name || "no name"}</span>
        </div>
      </div>

      <div className='flex items-center gap-0.5'>
       

        <button onClick={() => navigate('/admin/information')}>
          <IoPersonCircleSharp className='text-[12px] md:text-2xl text-one' />
        </button>
  <select
  onChange={handleLanguage}
  value={i18n.language}
  className="flex gap-1 items-center justify-center bg-one text-white"
>
            <GrLanguage />
            <option className='pb-1' value='ar'>AR</option> 
            <option className='pb-1 ' value='en'>EN</option> 
            <IoIosArrowDown />
          </select>
      </div>
  
  


    </div>
  );
}

export default AdminNavbar;
