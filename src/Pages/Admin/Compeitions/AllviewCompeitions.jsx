import React, { useState } from 'react'
import {  useLocation } from "react-router-dom";
import Gallery from './Gallery';
import Description from './Description';
import Subscribers from './Subscribers';
import { useNavigate } from "react-router-dom";
import { GiFastBackwardButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const AllviewCompeitions = () => {
   const [activeTab, setActiveTab] = useState('Gallery');
        const location = useLocation();
          const navigate = useNavigate();
         const { t, i18n } = useTranslation();
          const isRTL = i18n.language === "ar";
      const { sendData } = location.state || {};
  return (
   <div className="p-4">
      <button onClick={() => navigate(-1)}>
              <GiFastBackwardButton className="text-one text-3xl" />
            </button>
     <div className="flex gap-2  text-[14px] md:text-[20px]  mb-4 border-b justify-center pb-2">
        <button
          onClick={() => setActiveTab('Gallery')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Gallery' ? 'bg-[#3c57a6] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {(t("Gallery"))}
        </button>
        <button
          onClick={() => setActiveTab('Description')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Description' ? 'bg-[#3c57a6] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
{t("Description")}   </button>
        <button
          onClick={() => setActiveTab('Subscribers')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Subscribers' ? 'bg-[#3c57a6] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
 {t("Subscribers")}
   </button>
      </div>

      <div className="p-4 ">
        {activeTab ==="Gallery" &&<Gallery ID={sendData}/>}
        {activeTab ==="Description" &&<Description ID={sendData}/>}
        {activeTab ==="Subscribers" &&<Subscribers ID={sendData}/>}
      </div>
    </div>
  );  
}

export default AllviewCompeitions