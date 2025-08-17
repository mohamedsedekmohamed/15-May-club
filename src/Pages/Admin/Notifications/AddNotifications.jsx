import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../UI/InputField";
import FileUploadButton from "../../../UI/FileUploadButton";
import Inputfiltter from "../../../UI/Inputfiltter";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const AddNotifications = () => {
    const { t,i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [body, setbody] = useState("");
      const { sendData } = location.state || {};
       const [edit, setEdit] = useState(false);
        const [checkLoading, setCheckLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    
  });
        
  useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/notifications/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user = response.data.data;
          if (user) {
            setName(user.title || "");
            setbody(user.body || "");
          }
        })
        .catch((error) => {
          toast.error("Error fetching this User:", error);
        });
    }
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);
   const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "body") setbody(value);
  };
  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = t("nameRequired");
    if (!body) formErrors.body = t("namebody");

    Object.values(formErrors).forEach((error) => toast.error(error));
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleSave = () => {
    setCheckLoading(true);
    if (!validateForm()) {
      setCheckLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const newUser = {
      title:name,
   body
    };

   
    const request = edit
      ? axios.put(`https://app.15may.club/api/admin/notifications/${sendData}`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post("https://app.15may.club/api/admin//notifications/send", newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        toast.success(edit ? t("editnotificationsSuccess") : t("addnotificationsSuccess"));
        setTimeout(() => navigate("/admin/notifications"), 3000);
        setName("");
        setbody("");
       
      })
      .catch((error) => {
        const err = error?.response?.data?.error;
        if (err?.details && Array.isArray(err.details)) {
          err.details.forEach((detail) => toast.error(`${detail.field}: ${detail.message}`));
        } else if (err?.message) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong.");
        }
        setCheckLoading(false);
      });
  };

  if (loading) return <Loader />;

  return (
    <div className="mt-5 px-2">
       <ToastContainer />
            <div className="flex gap-5 px-2">
              <button onClick={() => navigate("/admin/notifications")}>
                <GiFastBackwardButton className="text-one text-3xl" />
              </button>
              <span className="text-3xl font-medium text-center text-four">
                {t("notifications")} / <span className="text-one">{edit ? t("edit") : t("add")}</span>
              </span>
            </div>
      <div className="flex gap-7 flex-wrap mt-10 pr-5 space-y-5">

             <InputField placeholder={t("title")} name="name" value={name} onChange={handleChange} />
        <InputField placeholder={t("body")} name="body" value={body} onChange={handleChange} />
       
    </div>
    
      <div className="flex mt-6">
        <button
          disabled={checkLoading}
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-[16px]"
          onClick={handleSave}
        >
          {checkLoading ? t("loading") : <span>{edit ? t("edit") : t("add")}</span>}
        </button>
      </div>
    </div>
  )
}

export default AddNotifications