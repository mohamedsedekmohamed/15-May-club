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
import MultiSelectField from "../../../UI/MultiSelectField";

const AddVotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendData } = location.state || {};

  const [edit, setEdit] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [startDate, setStartdate] = useState("");
  const [endDate, setEnddate] = useState("");

  const [optionId, setoptionId] = useState([]);
  const [optionIdtwo, setoptionIdtwo] = useState([]); // ✅ أصل البيانات
  const [optionsIds, setOptionIds] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sendData && sendData !== "Options") {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/votes/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const item = response.data.data.vote;
          if (item) {
            setTitle(item.name || "");
            setNumber(item.maxSelections || "");
            const formattedOptions = Array.isArray(item.options)
              ? item.options.map((p) => ({
                  value: p.id,
                  label: p.item,
                }))
              : [];
            setoptionId(formattedOptions);
            setoptionIdtwo(formattedOptions); // ✅ حفظ الأصل للمقارنة
            setDeletedItems(formattedOptions);
            setStartdate(item.startDate?.split("T")[0] || "");
            setEnddate(item.endDate?.split("T")[0] || "");
          }
        });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://app.15may.club/api/admin/votes/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const item = response.data.data;
        if (item) {
          setOptionIds(item.options || []);
        }
      });
  }, []);

  useEffect(() => {
    const removed = optionIdtwo.filter(
      (prev) => !optionId.find((current) => current.value === prev.value)
    );
    setDeletedItems(removed);
  }, [optionId, optionIdtwo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "number") setNumber(value);
  };

  const validateForm = () => {
    const formErrors = {};
    if (!title) formErrors.title = "Title is required";
    if (!number) formErrors.number = "Max Selections is required";
    if (!startDate) formErrors.startDate = "Start Date is required";
    if (!endDate) formErrors.endDate = "End Date is required";
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      formErrors.endDate = "End Date cannot be before Start Date";
    }
    if (optionId.length === 0) formErrors.optionId = "Options are required";

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

  const handStartDate = (date) => {
    setStartdate(date ? formatLocalDate(date) : "");
  };

  const handEndDate = (date) => {
    setEnddate(date ? formatLocalDate(date) : "");
  };

  const handleSave = () => {
    setCheckLoading(true);
    if (!validateForm()) {
      setCheckLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    const baseData = {
      name: title,
      startDate,
      endDate,
      maxSelections: Number(number),
    };

    if (edit) {
      const items = [];

      // ✅ عناصر جديدة أو تم تعديلها
      optionId.forEach((item) => {
        const original = optionIdtwo.find((old) => old.value === item.value);
        if (!original) {
          // عنصر جديد
          items.push({ id: item.value, value: item.label });
        } else if (original.label !== item.label) {
          // عنصر معدل
          items.push({ id: item.value, value: item.label });
        }
      });

      deletedItems.forEach((item) => {
        items.push(item.value);
      });

      const payload = {
        ...baseData,
        items,
      };

      console.log("EDIT payload:", payload);

      axios
        .put(`https://app.15may.club/api/admin/votes/${sendData}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("Vote updated successfully");
          resetForm();
        })
        .catch(handleError)
        .finally(() => setCheckLoading(false));
    } else {
      const newVote = {
        ...baseData,
        items: optionId.map(val=>val.value)
      };

      console.log("ADD payload:", newVote);

      axios
        .post("https://app.15may.club/api/admin/votes", newVote, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("Vote added successfully");
          resetForm();
        })
        .catch(handleError)
        .finally(() => setCheckLoading(false));
    }
  };

  const handleError = (error) => {
    const err = error?.response?.data?.error;
    if (err?.details && Array.isArray(err.details)) {
      err.details.forEach((detail) =>
        toast.error(`${detail.field}: ${detail.message}`)
      );
    } else if (err?.message) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong.");
    }
    setCheckLoading(false);
  };

  const resetForm = () => {
    setTimeout(() => {
      navigate("/admin/votes");
    }, 3000);
    setTitle("");
    setOptionIds([]);
    setStartdate("");
    setNumber("");
    setoptionId([]);
    setoptionIdtwo([]);
    setEnddate("");
    setEdit(false);
    setCheckLoading(false);
  };

  if (loading) {
    return (
      <div className="mt-40">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <ToastContainer />
      <div className="flex gap-5 px-2">
        <button onClick={() => navigate("/admin/votes")}>
          <GiFastBackwardButton className="text-one text-3xl" />
        </button>
        <span className="text-3xl font-medium text-center text-four">
          Votes / <span className="text-one">{edit ? "Edit" : "Add"}</span>
        </span>
      </div>

      <div className="flex gap-7 flex-wrap mt-10 pr-5 space-y-5">
        <InputField
          placeholder="Title"
          name="title"
          value={title}
          onChange={handleChange}
        />
        <InputField
          email="number"
          placeholder="Max Selections"
          name="number"
          value={number}
          onChange={handleChange}
        />

        <div className="relative flex flex-col h-[50px]">
          <FaRegCalendarAlt className="absolute top-[60%] right-10 transform -translate-y-1/2 text-one z-10" />
          <DatePicker
            selected={startDate}
            onChange={handStartDate}
            placeholderText="Start date"
            dateFormat="yyyy-MM-dd"
            className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown
            minDate={new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }))}
            yearDropdownItemNumber={100}
          />
        </div>

        <div className="relative flex flex-col h-[50px]">
          <FaRegCalendarAlt className="absolute top-[60%] right-10 transform -translate-y-1/2 text-one z-10" />
          <DatePicker
            selected={endDate}
            onChange={handEndDate}
            placeholderText="End date"
            dateFormat="yyyy-MM-dd"
            className="w-[280px] h-[60px] border-1 border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown
            minDate={new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }))}
            yearDropdownItemNumber={100}
          />
        </div>

        <MultiSelectField
          getname
          value={optionId}
          onChange={setoptionId}
          placeholder="Select Options"
          options={optionsIds}
        />
      </div>

      <div className="flex mt-6">
        <button
          disabled={checkLoading}
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-[16px]"
          onClick={handleSave}
        >
          {checkLoading ? "Loading" : <span>{edit ? "Edit" : "Add"}</span>}
        </button>
      </div>
    </div>
  );
};

export default AddVotes;
