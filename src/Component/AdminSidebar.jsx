import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SiFalcon } from "react-icons/si";
import HomeIcons from '../Icons/HomeIcons';
import SlidersIcons from '../Icons/SlidersIcons';
import PopupIcon from '../Icons/PopupIcon';
import VotesIcon from '../Icons/VotesIcon';
import ComplaintsIcon from '../Icons/ComplaintsIcon';
import CompetitionsIcon from '../Icons/CompetitionsIcon';
import PostIcon from '../Icons/PostIcon';
import NotificationsIcon from '../Icons/NotificationsIcon';
import { ImUser } from "react-icons/im";
import { ChevronDown } from 'lucide-react';
import { useTranslation } from "react-i18next";
import BannerIcon from '../Icons/BannerIcon'
import NumberIcon from '../Icons/NumberIcon';
const AdminSidebar = ({ setIsOpen, isOpen }) => {
  const { t } = useTranslation();

  const links = [
    {
      to: "home",
      name: t("sidebar.home"),
      icon: <HomeIcons />,
      iconActive: <HomeIcons active />
    },
    {
      to: "user",
      name: t("sidebar.users"),
      icon: <ImUser />,
      iconActive: <ImUser />
    },
    {
      to: "popup",
      name: t("sidebar.popups"),
      icon: <PopupIcon />,
      iconActive: <PopupIcon active />,
     
    },
    // {
    //   to: "popup",
    //   name: t("sidebar.popups"),
    //   icon: <PopupIcon />,
    //   iconActive: <PopupIcon active />,
    //   subLinks: [
    //     { to: "pages", name: t("sidebar.pages") },
    //   ]
    // },
    {
      to: "votes",
      name: t("sidebar.votes"),
      icon: <VotesIcon />,
      iconActive: <VotesIcon active />,
      // subLinks: [
      //   { to: "options", name: t("sidebar.options") },
      // ]
    },
    {
      to: "competitions",
      name: t("sidebar.competitions"),
      icon: <CompetitionsIcon />,
      iconActive: <CompetitionsIcon active />
    },
    {
      name: t("sidebar.complaints"),
      to: "complaints",
      icon: <ComplaintsIcon />,
      iconActive: <ComplaintsIcon active />,
      subLinks: [
        { to: "category", name: t("sidebar.categories") },
      ]
    },
    {
      name: t("sidebar.posts"),
      to: "posts",
      icon: <PostIcon />,
      iconActive: <PostIcon active />,
      subLinks: [
        { to: "categories", name: t("sidebar.categories") }
      ]
    },
    {
      to: "sliders",
      name: t("sidebar.sliders"),
      icon: <SlidersIcons />,
      iconActive: <SlidersIcons active />
    },
    {
      to: "notifications",
      name: t("NotificationsIcon"),
      icon: <NotificationsIcon />,
      iconActive: <NotificationsIcon active />
    },
    // {
    //   to: "banner",
    //   name: t("banner"),
    //   icon: <BannerIcon />,
    //   iconActive: <BannerIcon active />
    // },
    {
      to: "members",
      name: t("Members"),
      icon: <NumberIcon />,
      iconActive: <NumberIcon active />
    },
  ];

  const [isActive, setIsActive] = useState('/admin/home');
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const customPaths = {
      '/admin/addUser': '/admin/user',
      '/admin/addCompetitions': '/admin/competitions',
      '/admin/viewcompeitions': '/admin/competitions',
      '/admin/addcategory': '/admin/category',
      '/admin/addpopup': '/admin/popup',
      '/admin/addpages': '/admin/pages',
      '/admin/addvotes': '/admin/votes',
      '/admin/addoptions': '/admin/options',
      '/admin/addpost': '/admin/posts',
      '/admin/addcategories': '/admin/categories',
      '/admin/allposts': '/admin/posts',
      '/admin/addSliders': '/admin/sliders',
      '/admin/addbanner': '/admin/banner',
      '/admin/addmembers': '/admin/members',
    };

    const newPath = customPaths[location.pathname] || location.pathname;
    setIsActive(newPath);

    links.forEach(link => {
      if (link.subLinks?.some(sub => `/admin/${sub.to}` === newPath || newPath.includes(`/admin/${sub.to}`))) {
        setOpenMenus(prev => ({ ...prev, [link.name]: true }));
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleMenuClick = (link) => {
    setOpenMenus((prev) => ({
      ...prev,
      [link.name]: !prev[link.name],
    }));

    if (link.to) {
      setIsActive(`/admin/${link.to}`);
      navigate(`/admin/${link.to}`);
    }

    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const renderLinks = () =>
    links.map((link) => {
      const isCurrent = isActive === `/admin/${link.to}`;
      const isSubActive = link.subLinks?.some(sub => isActive === `/admin/${sub.to}`);
const isActiveParent = isCurrent;
      const isOpenMenu = openMenus[link.name] || false;

      if (link.subLinks) {
        return (
          <div key={link.name}>
            <div
              onClick={() => handleMenuClick(link)}
              className={`flex items-center justify-between cursor-pointer transition-all duration-200 rounded-lg h-[48px] px-2 ${isOpen ? 'w-full pl-2 gap-2' : 'justify-center w-full'} ${isActiveParent ? 'bg-white' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6">
                  {React.cloneElement(isActiveParent ? link.iconActive : link.icon, {
                    className: `w-[22px] h-[22px] ${isActiveParent ? 'text-one' : 'text-white'}`
                  })}
                </div>
                {isOpen && (
                  <span className={`font-bold text-[12px] lg:text-[16px] ${isActiveParent ? 'text-one' : 'text-white'}`}>
                    {link.name}
                  </span>
                )}
              </div>

              {isOpen && (
                <ChevronDown
                  className={`
                    w-4 h-4 transition-transform duration-800
                    ${isOpenMenu ? 'rotate-270' : ''}
                    ${isOpenMenu || isActiveParent ? 'text-one' : 'text-white'}
                  `}
                />
              )}
            </div>

            {isOpen && isOpenMenu && (
              <div className="ml-6 mt-1 space-y-1 border-l border-white/20 pl-3">
                {link.subLinks.map((sublink) => (
                  <NavLink
                    key={sublink.to}
                    to={sublink.to}
                    className={({ isActive }) =>
                      `block text-left text-[13px] font-medium rounded px-3 py-1 transition-all duration-200 ${
                        isActive ? 'bg-white text-one' : 'text-white hover:bg-white/10'
                      }`
                    }
                    onClick={() => {
                      setIsActive(`/admin/${sublink.to}`);
                      if (window.innerWidth < 768) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {sublink.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      }

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
    });

  return (
    <>
      <div className={`block md:hidden bg-one h-screen ${isOpen ? "absolute w-full" : ""} rounded-tr-3xl top-0 z-50 transition-all duration-300`}>
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
        <nav className="space-y-3 pt-6 text-center px-2 h-[calc(100vh-100px)] overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {renderLinks()}
        </nav>
      </div>

      <div className={`hidden md:block bg-one h-screen sticky rounded-tr-3xl top-0 z-50 transition-all duration-300`}>
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
        <nav className="space-y-3 pt-6 text-center px-2 h-[calc(100vh-100px)] overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {renderLinks()}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
