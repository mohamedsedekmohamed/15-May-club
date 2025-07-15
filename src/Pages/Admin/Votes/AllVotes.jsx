import React, { useEffect, useState } from 'react'
import AddVotes from './AddVotes';
import Option from './Options'
import {  useLocation } from "react-router-dom";

const AllVotes = () => {
  const [activeTab, setActiveTab] = useState('Votes');
       const location = useLocation();

 useEffect(()=>{
     const { sendData } = location.state || {};
 if(sendData==="Options")setActiveTab("Options")
 },[location.state])
   return (
    <div className="p-4">
      <div className="flex gap-4 mb-4 border-b justify-center pb-2">
         <button
           onClick={() => setActiveTab('Votes')}
           className={`px-4 py-2 rounded-t-md font-semibold ${
             activeTab === 'Votes' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
           }`}
         >
           Votes
         </button>
         <button
           onClick={() => setActiveTab('Options')}
           className={`px-4 py-2 rounded-t-md font-semibold ${
             activeTab === 'Options' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
           }`}
         >
 Options     
    </button>
       </div>
 
       {/* Tab Content */}
       <div className=" p-4  ">
         {activeTab === 'Votes' ? <AddVotes/> : <Option/>}
       </div>
     </div>
   );
 };  
export default AllVotes