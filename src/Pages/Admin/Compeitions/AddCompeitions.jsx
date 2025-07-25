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
import FileUploadButtonArroy from "../../../UI/FileUploadButtonArroy";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";

const AddCompeitions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendData } = location.state || {};
  const [edit, setEdit] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [imageuser, setImageuser] = useState(null);
  const [originalImages, setOriginalImages] = useState([]);
  const [imageChanged, setImageChanged] = useState(false);
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [imagesChanged, setImagesChanged] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartdate] = useState("");
  const [endDate, setEnddate] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");

      axios
        .get(`https://app.15may.club/api/admin/competitions/${sendData}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const item = response.data.data.competition;
          if (item) {
            setName(item.name || "");
            setDescription(item.description || "");
            setImageuser(item.mainImagepath || "");
            const oldImgs = Array.isArray(item.competitionImagesd)
              ? item.competitionImagesd.map((img) => ({
                  id: img.id,
                  imagePath: img.imagePath,
                }))
              : [];
            setImages(oldImgs);
            setOriginalImages(oldImgs);
            setStartdate(item.startDate?.split("T")[0] || "");
            setEnddate(item.endDate?.split("T")[0] || "");
          }
        })
        .catch((error) => {
          toast.error("Error fetching data");
        });
    }

    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);

  const handleFileChange = (file) => {
    if (file) {
      setImageuser(file);
      setImageChanged(true);
    }
  };

  const handleIamgesChange = (newFiles) => {
    if (edit) {
      const oldImagesWithId = originalImages;

      const keptOldImages = oldImagesWithId.filter((oldImg) =>
        newFiles.some((newImg) => newImg.id === oldImg.id)
      );

      const removedImages = oldImagesWithId.filter(
        (oldImg) => !newFiles.some((newImg) => newImg.id === oldImg.id)
      );

      const newAddedImages = newFiles.filter((img) => !img.id);

      setImages([...keptOldImages, ...newAddedImages]);
      setDeletedImages(removedImages);
      setImagesChanged(true);
    } else {
      setImages(newFiles);
      setImagesChanged(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "description") setDescription(value);
  };

  const validateForm = () => {
    const formErrors = {};
    if (!name) formErrors.title = "Title is required";
    if (!description) formErrors.description = "Description is required";
    if (!startDate) formErrors.startDate = "Start date is required";
    if (!endDate) formErrors.endDate = "End date is required";
    if (!edit && !imageuser) formErrors.imageuser = "Main image is required";
    if (!edit && images.length === 0)
      formErrors.images = "Gallery images required";

    Object.values(formErrors).forEach((err) => toast.error(err));
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handStartDate = (date) =>
    setStartdate(date ? formatLocalDate(date) : "");
  const handEndDate = (date) => setEnddate(date ? formatLocalDate(date) : "");

  const handleSave = () => {
    setCheckLoading(true);
    if (!validateForm()) {
      setCheckLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const newUseradd = {
      name,
      description,
      startDate,
      endDate,
      images: images.map(b=>b.imagePath),
      mainImagepath: imageuser,
    };

    const newUser = { name, description, startDate, endDate };

    if (!edit || imageChanged) {
      newUser.mainImagepath = imageuser;
    }

    if (edit && imagesChanged) {
      const newImages = images.filter((img) => !img.id);
      const removedImages = deletedImages;

      newUser.images = [
        ...newImages.map(({ imagePath }) => ({ imagePath })),
        ...removedImages.map(({ id, imagePath }) => ({ id, imagePath })),
      ];
    }

    const request = edit
      ? axios.put(
          `https://app.15may.club/api/admin/competitions/${sendData}`,
          newUser,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      : axios.post(
          "https://app.15may.club/api/admin/competitions",
          newUseradd,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

    request
      .then(() => {
        toast.success(`competitions ${edit ? "ُEdit" : "Add"}  successfully`);
        setTimeout(() => navigate("/admin/competitions"), 3000);

        setName("");
        setDescription("");
        setStartdate("");
        setEnddate("");
        setEdit(false);
        setImageuser(null);
        setImages([]);
        setDeletedImages([]);
      })
      .catch((error) => {
        const err = error?.response?.data?.error;
        if (err?.details?.length) {
          err.details.forEach((detail) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else if (err?.message) {
          toast.error(err.message);
        } else {
          toast.error("Error fatch ");
        }
        setCheckLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="mt-40">
        <Loader />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="mt-40">
        <Loader />
      </div>
    );
  }
  return (
    <div className=" mt-5">
      <ToastContainer />
      <div className="flex gap-5 px-2 ">
         <button onClick={() => navigate("/admin/competitions")}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
        <span className="text-3xl font-medium text-center text-four ">
          {" "}
          Competitions /
          <span className="text-one"> {edit ? "Edit " : "Add "}</span>{" "}
        </span>
       
      </div>
      <div className=" flex gap-7 flex-wrap  mt-10 pr-5 space-y-5 ">
        <InputField
          placeholder="Name"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <InputField
          placeholder="Description"
          name="description"
          value={description}
          onChange={handleChange}
        />

        <div className="relative flex flex-col  h-[50px] ">
          <FaRegCalendarAlt className="absolute top-[60%] right-10 transform -translate-y-1/2 text-one z-10" />
          <DatePicker
            selected={startDate}
            onChange={handStartDate}
            placeholderText="Start date"
            dateFormat="yyyy-MM-dd"
            className=" w-[280px]  h-[60px]  border-1  border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown
            minDate={
              new Date(
                new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })
              )
            }
            yearDropdownItemNumber={100}
          />
        </div>
        <div className="relative flex flex-col  h-[50px] ">
          <FaRegCalendarAlt className="absolute top-[60%] right-10 transform -translate-y-1/2 text-one z-10" />
          <DatePicker
            selected={endDate}
            onChange={handEndDate}
            placeholderText="End date"
            dateFormat="yyyy-MM-dd"
            className=" w-[280px]  h-[60px]  border-1  border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            minDate={
              new Date(
                new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })
              )
            }
          />
        </div>
        <FileUploadButton
          name="Image Card"
          kind="Image"
          flag={imageuser}
          onFileChange={handleFileChange}
        />
        <FileUploadButtonArroy
          name="Images"
          kind="gallery"
          flag={images}
          onFileChange={handleIamgesChange}
        />
      </div>

      <div className="flex mt-6">
        <button
          disabled={checkLoading}
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-[16px]"
          onClick={handleSave}
        >
          {checkLoading ? "Loading" : <span>{edit ? "Edit " : "Add "}</span>}
        </button>
      </div>
    </div>
  );
};

export default AddCompeitions;
