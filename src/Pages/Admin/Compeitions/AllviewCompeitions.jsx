import React, { useState } from 'react'
import {  useLocation } from "react-router-dom";
import Gallery from './Gallery';
import Description from './Description';
import Subscribers from './Subscribers';
const AllviewCompeitions = () => {
   const [activeTab, setActiveTab] = useState('Gallery');
        const location = useLocation();
      const { sendData } = location.state || {};
  return (
   <div className="p-4">
     <div className="flex gap-2  text-[14px] md:text-[20px]  mb-4 border-b justify-center pb-2">
        <button
          onClick={() => setActiveTab('Gallery')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Gallery' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveTab('Description')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Description' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
Description   </button>
        <button
          onClick={() => setActiveTab('Subscribers')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'Subscribers' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
 Subscribers
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