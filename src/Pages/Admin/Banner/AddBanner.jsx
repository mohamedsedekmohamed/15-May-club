import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import FileUploadButton from "../../../UI/FileUploadButton";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const AddBanner = () => {
  const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
  
    const navigate = useNavigate();
    const location = useLocation();
    const { sendData } = location.state || {};
    const [edit, setEdit] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageuser, setImageuser] = useState(null);
    const [orgimageuser, setorgImageuser] = useState(null);
    const [errors, setErrors] = useState({});
     useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/banners/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const item = response.data.data.banner;
          if (item) {
            setorgImageuser(item.imagePath || "");
            setImageuser(item.imagePath || "");
          }
        })
        .catch(() => toast.error(t("Error fetching this User:")));
    }

    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);
 const handleFileChange = (file) => {
    if (file) setImageuser(file);
  };
 const handleSave = () => {
    setCheckLoading(true);
   if (orgimageuser === imageuser) {
  toast.info(t("No changes detected."));
          setTimeout(() => navigate("/admin/banner"), 100);

  return;
}


    const token = localStorage.getItem("token");
    const newUser = {
      
    };

    if (orgimageuser !== imageuser) {
      newUser.image = imageuser;
    }

    const request = edit
      ? axios.put(`https://app.15may.club/api/admin/banners/${sendData}`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(`https://app.15may.club/api/admin/banners`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        setTimeout(() => navigate("/admin/banner"), 3000);
      
        setEdit(false);
        setImageuser(null);
        setorgImageuser(null);
      })
      .catch((error) => {
        const err = error?.response?.data?.error;
        if (err?.details && Array.isArray(err.details)) {
          err.details.forEach((detail) =>
            toast.error(`${detail.field}: ${detail.message}`)
          );
        } else if (err?.message) {
          toast.error(err.message);
        } else {
          toast.error(t("Somethingwentwrong."));
        }
        setCheckLoading(false);
      });
  };
  return (
       <div className="mt-5">
         <ToastContainer />
         <div className="flex gap-5 px-2">
           <button onClick={() => navigate("/admin/banner")}>
             <GiFastBackwardButton className="text-one text-3xl" />
           </button>
           <span className="text-3xl font-medium text-center text-four">
             {t("banner")} /<span className="text-one"> {edit ? t("Edit") : t("Add")}</span>
           </span>
         </div>
               <div className="flex gap-7 flex-wrap mt-10 space-y-5">

           <FileUploadButton
          name={t("Image")}
          kind="Image"
          flag={imageuser}
          onFileChange={handleFileChange}
        />
                 </div>

         <div className="flex mt-6">
        <button
          disabled={checkLoading}
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-[16px]"
          onClick={handleSave}
        >
          {checkLoading ? t("loading") : <span>{edit ? t("Edit") : t("Add")}</span>}
        </button>
      </div>
         </div>
  )
}

export default AddBanner