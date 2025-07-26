  // import React, { useEffect, useState } from 'react'
  // import {  useLocation } from "react-router-dom";
  // import AddPost from './AddPost';
  // import Categories from './Categories'
  // const AllPosts = () => {
  //     const [activeTab, setActiveTab] = useState('Posts');
  //       const location = useLocation();


  // useEffect(()=>{
  //     const { sendData } = location.state || {};
  // if(sendData==="Posts")setActiveTab("Categories")
  // },[location.state])
  //   return (
  //    <div className="">
  //      <div className="flex gap-4 mb-4 border-b justify-center pb-2">
  //         <button
  //           onClick={() => setActiveTab('Posts')}
  //           className={`px-4 py-2 rounded-t-md font-semibold ${
  //             activeTab === 'Posts' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
  //           }`}
  //         >
  //           Posts
  //         </button>
  //         <button
  //           onClick={() => setActiveTab('Categories')}
  //           className={`px-4 py-2 rounded-t-md font-semibold ${
  //             activeTab === 'Categories' ? 'bg-[#876340] text-white' : 'bg-gray-100 text-gray-700'
  //           }`}
  //         >
  // Categories     
  //    </button>
  //       </div>

  //       <div className="px-2 ">
  //         {activeTab === 'Posts' ? <AddPost/> : <Categories/>}
  //       </div>
  //     </div>
  //   );
  // };  

  // export default AllPosts