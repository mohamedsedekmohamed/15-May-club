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

const AddUser = () => {
  const { t,i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setbirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [purpose, setPurpose] = useState("");
  const [imageuser, setImageuser] = useState("");
  const [edit, setEdit] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const { sendData } = location.state || {};

  const handleFileChange = (file) => {
    if (file) setImageuser(file);
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/users/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user = response.data.data;
          if (user) {
            setName(user.name || "");
            setPhone(user.phoneNumber || "");
            setEmail(user.email || "");
            setbirthdate(user.dateOfBirth?.split("T")[0] || "");
            setRole(user.role || "");
            setPurpose(user.purpose || "");
            setImageuser(user.imagePath || "");
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
    if (name === "phone") setPhone(value);
    if (name === "role") setRole(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "purpose") setPurpose(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = t("nameRequired");
    if (!birthdate) formErrors.birthdate = t("birthdateRequired");
    if (!phone) formErrors.phone = t("phoneRequired");
    else if (!/^01\d{9}$/.test(phone)) formErrors.phone = t("phoneInvalid");
    if (role === "guest" && !purpose) formErrors.purpose = t("purposeRequired");
    if (role === "number" && !imageuser) formErrors.imageuser = t("imageRequired");
    if (!role) formErrors.gender = t("roleRequired");
    if (!email.includes("@gmail.com")) formErrors.email = t("emailInvalid");
    if (!edit && (!password || password.length < 8)) {
      formErrors.password = t("passwordShort");
    }
    Object.values(formErrors).forEach((error) => toast.error(error));
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

const handstartDate = (newData) => {
  if (newData) {
    const localDate = new Date(newData.getTime() - newData.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    setbirthdate(localDate);
  } else {
    setbirthdate("");
  }
};

  const handleSave = () => {
    setCheckLoading(true);
    if (!validateForm()) {
      setCheckLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const newUser = {
      name,
      phoneNumber: phone,
      email,
      role,
      dateOfBirth: birthdate,
    };

    if (!edit) {
      newUser.password = password;
      if (role === "guest") newUser.purpose = purpose;
      if (role === "member") newUser.imageBase64 = imageuser;
    } else {
      if (password && password.length >= 8) newUser.password = password;
      if (role === "member" && imageuser && !imageuser.startsWith("/uploads")) {
        newUser.imagePath = imageuser;
      }
      if (role === "guest") newUser.purpose = purpose;
    }

    const request = edit
      ? axios.put(`https://app.15may.club/api/admin/users/${sendData}`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post("https://app.15may.club/api/admin/users", newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        toast.success(edit ? t("editUserSuccess") : t("addUserSuccess"));
        setTimeout(() => navigate("/admin/user"), 3000);
        setbirthdate("");
        setName("");
        setPhone("");
        setRole("");
        setPurpose("");
        setEmail("");
        setPassword("");
        setEdit(false);
        setImageuser(null);
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
        <button onClick={() => navigate("/admin/user")}>
          <GiFastBackwardButton className="text-one text-3xl" />
        </button>
        <span className="text-3xl font-medium text-center text-four">
          {t("user")} / <span className="text-one">{edit ? t("edit") : t("add")}</span>
        </span>
      </div>

      <div className="flex gap-7 flex-wrap mt-10 pr-5 space-y-5">
        <InputField placeholder={t("user")} name="name" value={name} onChange={handleChange} />
        <InputField placeholder={t("phone")} name="phone" value={phone} onChange={handleChange} />
        <InputField placeholder={t("email")} name="email" value={email} onChange={handleChange} />
        <InputField placeholder={t("password")} name="password" value={password} onChange={handleChange} />
        <Inputfiltter placeholder={t("role")} name="role" value={role} like onChange={handleChange} />

    <div className="relative flex flex-col justify-end pb-5 h-[80px]"> {/* زودنا الارتفاع */}
  <label className="text-sm text-one mb-1">
    {t("selectDate")} 
  </label>

  <div className="relative">
    <FaRegCalendarAlt
      className={`absolute top-[50%] ${i18n.language === "ar" ? "left-10" : "right-10"} transform -translate-y-1/2 text-one z-10`}
    />
    <DatePicker
      selected={birthdate}
      onChange={handstartDate}
      placeholderText={t("selectDate")}
      dateFormat="yyyy-MM-dd"
      className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
      showYearDropdown
      scrollableYearDropdown
      maxDate={new Date()}
      yearDropdownItemNumber={100}
    />
  </div>
</div>

      </div>

      <div className="mt-10 md:mt-5">
        {role === "member" && (
          <FileUploadButton name={t("image")} kind="Image" flag={imageuser} onFileChange={handleFileChange} />
        )}
        {role === "guest" && (
          <InputField placeholder={t("purpose")} name="purpose" value={purpose} onChange={handleChange} />
        )}
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
  );
};

export default AddUser;
