import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCrown } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const Information = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://app.15may.club/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setData(response.data.data)
    });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className={`flex flex-col p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Top Section */}
      <div className='bg-seven w-full flex flex-col md:flex-row items-center md:items-start relative rounded-lg p-4 md:p-6'>
        {/* Avatar */}
        <div className={`flex justify-center items-center mb-4 md:mb-0 ${isRTL ? 'md:ml-6' : 'md:mr-6'}`}>
          <img
            src={data?.imagePath ?? null}
            className='w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border'
            alt="avatar"
          />
        </div>

        {/* Info */}
        <div className='flex flex-col text-center md:text-left'>
          <span className='text-2xl md:text-3xl font-medium text-one mb-2'>
            {data.name || t("no_name")}
          </span>
          <span className='text-base text-one mb-3'>
            {data.email || t("no_email")}
          </span>
          <span className='text-sm text-one bg-eight px-3 py-1 rounded flex items-center justify-center md:justify-start gap-2 w-fit self-center md:self-start'>
            <FaCrown />
            {t("super_admin")}
          </span>
        </div>

        {/* Buttons */}
        <button
          onClick={handleLogout}
          className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-one text-2xl hover:text-red-500`}
          title={t("logout")}
        >
          <CiLogout />
        </button>

        <button
          onClick={() => navigate('/admin/AddInformation')}
          className={`absolute top-14 ${isRTL ? 'left-3' : 'right-3'} text-one text-2xl hover:text-yellow-500`}
          title={t("edit_profile")}
        >
          <FaUserEdit />
        </button>
      </div>

      {/* Bottom Section */}
      <div className='mt-6 w-full'>
        <div className='bg-seven w-full rounded-lg p-5'>
          <div className='flex items-center gap-2 mb-4'>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 0C5.81875 0 0 5.81875 0 13C0 20.1812 5.81875 26 13 26C20.1812 26 26 20.1812 26 13C26 5.81875 20.1812 0 13 0ZM12.7188 6.5C13.4125 6.5 13.9688 7.0625 13.9688 7.75C13.9688 8.4375 13.4062 9 12.7188 9C12.0312 9 11.4688 8.4375 11.4688 7.75C11.4688 7.0625 12.025 6.5 12.7188 6.5ZM15 19H11V18.5H12V11H11V10.5H14V18.5H15V19Z" fill="#3c57a6" />
            </svg>
            <span className='text-xl font-medium text-one'>
              {t("personal_info")}
            </span>
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-lg text-one'>
              {t("phone_number")}: {data.phoneNumber || t("no_phone")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
