import React from 'react';
import { MdEditNotifications } from "react-icons/md";

const NotificationsIcon = ({ active }) => {
  const iconColor = active ? "#876340" : "#FFFFFF";
  
  return (
    <div>
      <MdEditNotifications 
        className="w-6 h-6" 
        style={{ color: iconColor }} 
      />
    </div>
  );
};

export default NotificationsIcon;
