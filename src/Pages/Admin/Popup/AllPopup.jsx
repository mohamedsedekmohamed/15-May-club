import React, { useEffect, useState } from 'react'
import Addpopup from './Addpopup';
import Pages from './Pages'
import {  useLocation } from "react-router-dom";

const AllPopup = () => {
    const [activeTab, setActiveTab] = useState('popup');
      const location = useLocation();


useEffect(()=>{
    const { sendData } = location.state || {};
if(sendData==="page")setActiveTab("Pages")
},[location.state])
  return (
   <div className="p-4">
     <div className="flex gap-4 mb-4 border-b justify-center pb-2">
        <button
          onClick={() => setActiveTab('popup')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'popup' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Popup
        </button>
        <button
          onClick={() => setActiveTab('Pages')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Pages' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
Pages     
   </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 ">
        {activeTab === 'popup' ? <Addpopup/> : <Pages/>}
      </div>
    </div>
  );
};  

export default AllPopup