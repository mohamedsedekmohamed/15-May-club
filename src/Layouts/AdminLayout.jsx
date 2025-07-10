import React, { useEffect, useState } from 'react';
import AdminSidebar from "../component/AdminSidebar";
import AdminNavbar from "../component/AdminNavbar";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);



  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex overflow-hidden h-screen relative">
      {/* Sidebar */}
      <aside className={`transition-all duration-100 ${isOpen ? 'w-56  ' : 'w-16'}  p-1  z-10 top-0 h-screen`}>
        <AdminSidebar setIsOpen={setIsOpen} isOpen={isOpen} />
      </aside>

      <div className="flex-1 flex flex-col w-full overflow-auto p-2">
        <header className="rounded-[12px] shadow p-4 m-2">
          <AdminNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
        </header>

        <main className="flex-1  w-full ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
