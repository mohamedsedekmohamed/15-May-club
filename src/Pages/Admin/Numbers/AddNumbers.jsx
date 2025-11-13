import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../UI/InputField";
import FileUploadButton from "../../../UI/FileUploadButton";
import SwitchButton from "../../../UI/SwitchButton";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const AddNumbers = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { sendData } = location.state || {};
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [nameSymbol, setNameSymbol] = useState("");
  const [photoSymbol, setPhotoSymbol] = useState(null);
  const [number, setNumber] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/members/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const item = response.data.data.member;
          if (item) {
            setName(item.name || "");
            setNameSymbol(item.nameSymbol || "");
            setNumber(item.number || "");
            setPhoto(item.photo || "");
            setPhotoSymbol(item.photoSymbol || "");
          }
        })
        .catch(() => toast.error(t("Errorfetchingdata")));
    }

    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.state]);

  const handleFileChange = (file, field) => {
    if (field === "photo") setPhoto(file);
    if (field === "photoSymbol") setPhotoSymbol(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "nameSymbol") setNameSymbol(value);
    if (name === "number") setNumber(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = t("Nameisrequired");
    if (!nameSymbol) formErrors.nameSymbol = t("Namesymbolisrequired");
    if (!number) formErrors.number = t("Numberisrequired");
    if (!photo) formErrors.photo = t("Photoisrequired");
    if (!photoSymbol) formErrors.photoSymbol = t("Photosymbolisrequired");

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
    const newData = {
      name,
      nameSymbol,
      number:String(number),
      photo,
      photoSymbol,
    };

    const request = edit
      ? axios.put(`https://app.15may.club/api/admin/members/${sendData}`, newData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(`https://app.15may.club/api/admin/members`, newData, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        toast.success(edit ? t("Updatedsuccessfully") : t("Addedsuccessfully"));
setTimeout(() => navigate("/admin/members", { state: { refresh: true } }), 500);
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
          toast.error(t("Somethingwentwrong"));
        }
        setCheckLoading(false);
      });
  };

  if (loading) return <div className="mt-40"><Loader /></div>;

  return (
    <div className="mt-5">
      <ToastContainer />
      <div className="flex gap-5 px-2">
        <button onClick={() => navigate("/admin/members")}>
          <GiFastBackwardButton className="text-one text-3xl" />
        </button>
        <span className="text-3xl font-medium text-center text-four">
          {t("Member")} / <span className="text-one">{edit ? t("Edit") : t("Add")}</span>
        </span>
      </div>

      <div className="flex gap-7 flex-wrap mt-10 space-y-5">
        <InputField placeholder={t("Name")} name="name" value={name} onChange={handleChange} />
        <InputField placeholder={t("NameSymbol")} name="nameSymbol" value={nameSymbol} onChange={handleChange} />
        <InputField placeholder={t("Number")} email={"number"}  name="number" value={number} onChange={handleChange} />

        <FileUploadButton name={t("Photo")} kind={t("Image")} flag={photo} onFileChange={(f) => handleFileChange(f, "photo")} />
        <FileUploadButton name={t("PhotoSymbol")} kind={t("PhotoSymbol")} flag={photoSymbol} onFileChange={(f) => handleFileChange(f, "photoSymbol")} />
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

export default AddNumbers;
