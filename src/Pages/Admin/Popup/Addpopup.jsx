// الكود الكامل مع الترجمة:
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
import SwitchButton from "../../../UI/SwitchButton";
import MultiSelectField from "../../../UI/MultiSelectField";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const Addpopup = () => {
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
  const [title, setTitle] = useState("");
  const [startDate, setStartdate] = useState("");
  const [endDate, setEnddate] = useState("");
  const [status, setStatus] = useState("active");
  const [pageIds, setPageIds] = useState([]);
  const [optionspageIds, setOptionPageIds] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/popups/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const item = response.data.data.popup;
          if (item) {
            setTitle(item.title || "");
            setPageIds(
              Array.isArray(item.pages)
                ? item.pages.map((p) => ({ value: p.pageId, label: p.pageName }))
                : []
            );
            setStartdate(item.startDate?.split("T")[0] || "");
            setEnddate(item.endDate?.split("T")[0] || "");
            setImageuser(item.imagePath || "");
            setorgImageuser(item.imagePath || "");
            setStatus(item.status || "");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!title) formErrors.title = t("Titleisrequired");
    if (!startDate) formErrors.startDate = t("StartDateisrequired");
    if (!endDate) formErrors.endDate = t("EndDateisrequired");
    if (!pageIds.length) formErrors.pageIds = t("pagedarerequired");
    if (!imageuser) formErrors.imageuser = t("Imageisrequired");

    Object.values(formErrors).forEach((error) => toast.error(error));
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handStartDate = (newData) => {
    if (newData) setStartdate(formatLocalDate(newData));
    else setStartdate("");
  };

  const handEndDate = (newData) => {
    if (newData) setEnddate(formatLocalDate(newData));
    else setEnddate("");
  };

  const handleSave = () => {
    setCheckLoading(true);
    if (!validateForm()) {
      setCheckLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const newUser = {
      title,
      startDate,
      endDate,
      status,
      pageIds: pageIds.map((item) => item.value),
    };

    if (orgimageuser !== imageuser) {
      newUser.imagePath = imageuser;
    }

    const request = edit
      ? axios.put(`https://app.15may.club/api/admin/popups/${sendData}`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(`https://app.15may.club/api/admin/popups`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        toast.success(edit ? t("popupupdatedsuccessfully") : t(" popupaddedsuccessfully"));
        setTimeout(() => navigate("/admin/popup"), 3000);
        setStatus("active");
        setTitle("");
        setPageIds([]);
        setStartdate("");
        setEnddate("");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://app.15may.club/api/admin/popups/apppages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const item = response.data.data;
        if (item) setOptionPageIds(item.Apppages || "");
      })
      .catch(() => toast.error(t("Error fetching this User:")));
  }, []);

  if (loading) return <div className="mt-40"><Loader /></div>;

  return (
    <div className="mt-5">
      <ToastContainer />
      <div className="flex gap-5 px-2">
        <button onClick={() => navigate("/admin/popup")}>
          <GiFastBackwardButton className="text-one text-3xl" />
        </button>
        <span className="text-3xl font-medium text-center text-four">
          {t("Popup")} /<span className="text-one"> {edit ? t("Edit") : t("Add")}</span>
        </span>
      </div>

      <div className="flex gap-7 flex-wrap mt-10 space-y-5">
        <InputField
          placeholder={t("Title")}
          name="title"
          value={title}
          onChange={handleChange}
        />

        <div className="relative flex flex-col h-[50px]">
          <FaRegCalendarAlt className={`absolute top-[60%] ${ isRTL?"left-10":"right-10"} transform -translate-y-1/2 text-one z-10`} />
          <DatePicker
            selected={startDate}
            onChange={handStartDate}
            placeholderText={t("Startdate")}
            dateFormat="yyyy-MM-dd"
            className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown
            minDate={new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }))}
            yearDropdownItemNumber={100}
          />
        </div>

        <div className="relative flex flex-col h-[50px]">
          <FaRegCalendarAlt className={`absolute top-[60%] ${ isRTL?"left-10":"right-10"} transform -translate-y-1/2 text-one z-10`} />
          <DatePicker
            selected={endDate}
            onChange={handEndDate}
            placeholderText={t("Enddate")}
            dateFormat="yyyy-MM-dd"
            className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            minDate={new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }))}
          />
        </div>

        <FileUploadButton
          name={t("Image")}
          kind="Image"
          flag={imageuser}
          onFileChange={handleFileChange}
        />

        <MultiSelectField
          value={pageIds}
          onChange={setPageIds}
          placeholder={t("SelectPages")}
          options={optionspageIds}
        />

        <SwitchButton setValue={setStatus} value={status} />
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
  );
};

export default Addpopup;
