import React from 'react'
import { LuWallpaper } from "react-icons/lu";

const BannerIcon = ({ active }) => {
  const iconStyle = active ? "#876340" : "#FFFFFF";
  return (
    <div>
      <LuWallpaper className="text-2xl" style={{ color: iconStyle }} />
    </div>
  );
};

export default BannerIcon
;
