import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../UI/InputField";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const AddVotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendData } = location.state || {};
  const { t, i18n } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  // keep dates as Date objects so DatePicker works
  const [startDate, setStartdate] = useState(null);
  const [endDate, setEnddate] = useState(null);

  // unify shape: array of { id: string|null, label: string }
  const [fields, setFields] = useState([{ id: "", label: "" }]);
  const [optionIdtwo, setoptionIdtwo] = useState([]); // original options from server (array of {id,label})
  const [deletedItems, setDeletedItems] = useState([]); // removed original options (array of original objects)

  useEffect(() => {
    if (sendData && sendData !== "Options") {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/votes/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const item = response.data.data.vote;
          if (item) {
            setTitle(item.name || "");
            setNumber(item.maxSelections || "");
            // FORMAT options into objects with id + label
            const formattedOptions = Array.isArray(item.options)
              ? item.options.map((p) => ({ id: p.id, label: p.item }))
              : [];
            // setFields to the array of objects (not to labels)
            setFields(formattedOptions.length ? formattedOptions : [{ id: "", label: "" }]);
            setoptionIdtwo(formattedOptions); // keep original snapshot
            setDeletedItems([]); // none deleted initially
            // set Date objects (if server returns "YYYY-MM-DD")
            setStartdate(item.startDate ? new Date(item.startDate) : null);
            setEnddate(item.endDate ? new Date(item.endDate) : null);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [location.state, sendData]);

  // compute deleted original options: those in optionIdtwo but not in current fields (by id)
  useEffect(() => {
    const removed = optionIdtwo.filter(
      (orig) => !fields.find((f) => f.id && f.id === orig.id)
    );
    setDeletedItems(removed);
  }, [fields, optionIdtwo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "number") setNumber(value);
  };

  const validateForm = () => {
    const formErrors = {};
    if (!title) formErrors.title = t("Titleisrequired");
    if (!number) formErrors.number = t("MaxSelectionsIsRequired");
    if (!startDate) formErrors.startDate = t("StartDateisrequired");
    if (!endDate) formErrors.endDate = t("EndDateisrequired");
    if (startDate && endDate && endDate < startDate) {
      formErrors.endDate = t("EndDatecannotbebeforeStartDate");
    }
    if (!fields || fields.length === 0 || fields.every(f => !f.label.trim()))
      formErrors.optionId = t("OptionsAreRequired");
    Object.values(formErrors).forEach((error) => toast.error(error));
    return Object.keys(formErrors).length === 0;
  };

  const handStartDate = (date) => setStartdate(date || null);
  const handEndDate = (date) => setEnddate(date || null);

  const handleSave = async () => {
    setCheckLoading(true);
    if (!validateForm()) {
      setCheckLoading(false);
      return;
    }
    const token = localStorage.getItem("token");

    // convert dates to yyyy-mm-dd when sending
    const serializeDate = (d) =>
      d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0] : "";

    const baseData = {
      name: title,
      startDate: serializeDate(startDate),
      endDate: serializeDate(endDate),
      maxSelections: Number(number),
    };

    try {
      if (edit) {
        const items = [];

        // new items -> send as strings (labels)
        // updated items -> send as { id, value }
        fields.forEach((item) => {
          const original = optionIdtwo.find((o) => o.id === item.id);
          if (!original) {
       
            if (item.label && item.label.trim()) items.push({ value:item.label.trim()});
          } else if (original.label !== item.label) {
            items.push({ id: item.id, value: item.label.trim() });
          }
        });        deletedItems.forEach((d) => {
          if (d.id) items.push(d.id);
        });

        const payload = { ...baseData, items };
        console.log(payload)
        await axios.put(`https://app.15may.club/api/admin/votes/${sendData}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t("Voteupdatedsuccessfully"));
        resetForm();
      } else {
        // add: backend expects array of strings (items)
        const newVote = {
          ...baseData,
          items: fields.map((f) => f.label.trim()).filter(Boolean),
        };
        await axios.post("https://app.15may.club/api/admin/votes", newVote, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t("Voteaddedsuccessfully"));
        resetForm();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setCheckLoading(false);
    }
  };

  const handleError = (error) => {
    const err = error?.response?.data?.error;
    if (err?.details && Array.isArray(err.details)) {
      err.details.forEach((detail) => toast.error(`${detail.field}: ${detail.message}`));
    } else if (err?.message) {
      toast.error(err.message);
    } else {
      toast.error(t("Something went wrong."));
    }
  };

  const resetForm = () => {
    setTitle("");
    setStartdate(null);
    setNumber("");
    setFields([{ id: "", label: "" }]);
    setoptionIdtwo([]);
    setEnddate(null);
    setEdit(false);
    setTimeout(() => navigate("/admin/votes"), 1500);
  };

  // update label in a safe way (works whether previous value existed or not)
  const handleChangeInput = (index, value) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, label: value } : f))
    );
  };

  const handleAddField = () => setFields((prev) => [...prev, { id: "", label: "" }]);

  const handleRemoveField = (index) =>
    setFields((prev) => prev.filter((_, i) => i !== index));

  if (loading) return <div className="mt-40"><Loader /></div>;

  return (
    <div className="mt-5">
      <ToastContainer />
      {/* header omitted for brevity */}
      <div className="flex gap-7 flex-wrap mt-10 pr-5 space-y-5">
        <InputField placeholder={t("Title")} name="title" value={title} onChange={handleChange} />
        <InputField email="number" placeholder={t("MaxSelections")} name="number" value={number} onChange={handleChange} />
        <div className="relative flex flex-col justify-end pb-5 h-[80px]">
          {" "}
          <label className="text-sm text-one mb-1">{t("Startdate")}</label>
          <div className="relative">
            <FaRegCalendarAlt
              className={`absolute top-[50%] ${
                i18n.language === "ar" ? "left-10" : "right-10"
              } transform -translate-y-1/2 text-one z-10`}
            />{" "}
            <DatePicker
              selected={startDate}
              onChange={handStartDate}
              placeholderText={t("Startdate")}
              dateFormat="yyyy-MM-dd"
              className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
              showYearDropdown
              scrollableYearDropdown
              minDate={
                new Date(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Africa/Cairo",
                  })
                )
              }
              yearDropdownItemNumber={100}
            />
          </div>
        </div>
        <div className="relative flex flex-col justify-end pb-5 h-[80px]">
          {" "}
          <label className="text-sm text-one mb-1">{t("Enddate")}</label>
          <div className="relative">
            <FaRegCalendarAlt
              className={`absolute top-[50%] ${
                i18n.language === "ar" ? "left-10" : "right-10"
              } transform -translate-y-1/2 text-one z-10`}
            />{" "}
            <DatePicker
              selected={endDate}
              onChange={handEndDate}
              placeholderText={t("Enddate")}
              dateFormat="yyyy-MM-dd"
              className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
              showYearDropdown
              scrollableYearDropdown
              minDate={
                new Date(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Africa/Cairo",
                  })
                )
              }
              yearDropdownItemNumber={100}
            />
        </div>
        </div>


      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-one">Options</h2>
        <div className="flex flex-wrap gap-4">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleChangeInput(index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="p-2 border border-gray-300 rounded-md w-64"
              />
              <button onClick={() => handleRemoveField(index)} className="text-red-600 font-semibold">
                Delete
              </button>
            </div>
          ))}
        </div>

        <button onClick={handleAddField} className="px-4 py-2 bg-one text-white rounded-md">+ New</button>
      </div>

      <div className="flex mt-6">
        <button disabled={checkLoading} className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-[16px]" onClick={handleSave}>
          {checkLoading ? t("loading") : <span>{edit ? t("Edit") : t("Add")}</span>}
        </button>
      </div>
    </div>
  );
};

export default AddVotes;
