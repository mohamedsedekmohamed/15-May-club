import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { SiFalcon } from "react-icons/si";
import HomeIcons from '../Icons/HomeIcons'
import SlidersIcons from '../Icons/SlidersIcons'
import PopupIcon from '../Icons/PopupIcon'
import VotesIcon from '../Icons/VotesIcon'
import ComplaintsIcon from '../Icons/ComplaintsIcon'
import CompetitionsIcon from '../Icons/CompetitionsIcon'
import PendingUserIcon from '../Icons/PendingUserIcon'
import PostIcon from '../Icons/PostIcon'
import RejectedIcon from '../Icons/RejectedIcon'
import LogOutIcon from '../Icons/LogOutIcon'
import { ImUser } from "react-icons/im";

const links = [
  {
    to: "home",
    name: "Home",
    icon: <HomeIcons />,
    iconActive: <HomeIcons active />
  },
  {
    to: "user",
    name: "User",
    icon: <ImUser />,
    iconActive: <ImUser />
  },
  {
    to: "popup",
    name: "Popup Iamge",
    icon: <PopupIcon />,
    iconActive: <PopupIcon active />
  },
   {
    to: "votes",
    name: "Votes",
    icon: <VotesIcon />,
    iconActive: <VotesIcon active   />
  },
  {
    to: "competitions",
    name: "Competitions",
    icon: <CompetitionsIcon  />,
    iconActive: <CompetitionsIcon active />
  },
  {
    to: "complaints",
    name: "Complaints",
    icon: <ComplaintsIcon  />,
    iconActive: <ComplaintsIcon active  />
  },
  {
    to: "posts",
    name: "Posts",
    icon: <PostIcon  />,
    iconActive: <PostIcon  active />
  },
  {
    to: "sliders",
    name: "Sliders",
    icon: <SlidersIcons  />,
    iconActive: <SlidersIcons active  />
  },
  // {
  //   to: "pending_users",
  //   name: "Pending users",
  //   icon: <PendingUserIcon  />,
  //   iconActive: <PendingUserIcon active  />
  // },
  // {
  //   to: "rejected_users",
  //   name: "Rejected Users",
  //   icon: <RejectedIcon  />,
  //   iconActive: <RejectedIcon active  />
  // },
  {
    to: "logout",
    name: "Logout",
    icon: <LogOutIcon />,
    iconActive: <LogOutIcon active  />
  },
 
  
];

const AdminSidebar = ({ setIsOpen, isOpen }) => {
  const [isActive, setIsActive] = useState('/admin/home');
  const location = useLocation();

  useEffect(() => {
    const customPaths = {
      '/admin/addUser': '/admin/user',
      '/admin/addCompetitions':'/admin/competitions',
      '/admin/viewcompeitions':'/admin/competitions',
      '/admin/addpopup': '/admin/popup',
      '/admin/allpopup': '/admin/popup',
      '/admin/addpages': '/admin/popup',
      '/admin/allvotes': '/admin/votes',
      '/admin/addoptions': '/admin/votes',
      '/admin/allPosts': '/admin/posts',
      '/admin/addCategories': '/admin/posts',
      '/admin/allposts': '/admin/posts',
      '/admin/addSliders': '/admin/sliders',
     
    };

    const newPath = customPaths[location.pathname] || location.pathname;
    setIsActive(newPath);
  }, [location.pathname]);

 
useEffect(() => {
  if (isOpen && window.innerWidth < 768) {
    setIsOpen(false);
  }
}, [location.pathname]);

  return (
    <>
    
    <div className={` block md:hidden bg-one  h-screen  ${isOpen?"absolute w-full":""}  rounded-tr-3xl top-0 z-50 transition-all duration-300 `}>
      
      <div
        className={`flex items-center ${isOpen ? 'justify-start gap-4 px-4' : 'justify-center'} py-4 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        
        <SiFalcon className="w-6 h-6 text-white" />
        
        {isOpen && (
          <h1 className="text-white font-bold text-[14px] lg:text-[20px]">15 May Club</h1>
        )}
      </div>

      <div className="border-1 border-gray-300 w-full px-3" />

      <nav
        className={`space-y-3 pt-6 text-center px-2 h-[calc(100vh-100px)] overflow-y-auto`}
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {links.map((link) => {
          const isCurrent = isActive === `/admin/${link.to}`;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center transition-all duration-200 rounded-lg h-[48px] ${isOpen ? 'w-full pl-4 gap-3' : 'justify-center w-full'} ${isCurrent ? 'bg-white' : ''}`}
            >
              <div className="w-6 h-6">
                {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                  className: `w-[22px] h-[22px] ${isCurrent ? 'text-one' : 'text-white'}`
                })}
              </div>
              {isOpen && (
                <span className={`font-bold text-[12px] lg:text-[16px] ${isCurrent ? 'text-one' : 'text-white'}`}>
                  {link.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
     <div className={` hidden md:block bg-one  h-screen sticky  rounded-tr-3xl top-0 z-50 transition-all duration-300 `}>
      
      <div
        className={`flex items-center ${isOpen ? 'justify-start gap-4 px-4' : 'justify-center'} py-4 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        
        <SiFalcon className="w-6 h-6 text-white" />
        
        {isOpen && (
          <h1 className="text-white font-bold text-[14px] lg:text-[20px]">15 May Club</h1>
        )}
      </div>

      <div className="border-1 border-gray-300 w-full px-3" />

      <nav
        className={`space-y-3 pt-6 text-center px-2 h-[calc(100vh-100px)] overflow-y-auto`}
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {links.map((link) => {
          const isCurrent = isActive === `/admin/${link.to}`;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center transition-all duration-200 rounded-lg h-[48px] ${isOpen ? 'w-full pl-4 gap-3' : 'justify-center w-full'} ${isCurrent ? 'bg-white' : ''}`}
            >
              <div className="w-6 h-6">
                {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                  className: `w-[22px] h-[22px] ${isCurrent ? 'text-one' : 'text-white'}`
                })}
              </div>
              {isOpen && (
                <span className={`font-bold text-[12px] lg:text-[16px] ${isCurrent ? 'text-one' : 'text-white'}`}>
                  {link.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
        </>

  );
};

export default AdminSidebar;
