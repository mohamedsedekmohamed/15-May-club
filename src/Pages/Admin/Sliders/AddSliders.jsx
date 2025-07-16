import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../UI/InputField";
import FileUploadButtonArroy from "../../../UI/FileUploadButtonArroy";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";

const AddSliders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendData } = location.state || {};
  const [edit, setEdit] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [loading, setLoading] = useState(true);
    
const [images, setImages] = useState([]);
 const [deletedImages, setDeletedImages] = useState([]);
  const [imagesChanged, setImagesChanged] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    order: "",
  });
  useEffect(() => {
    if (sendData) {
      setEdit(true);
      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/sliders/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const item = response.data.data;
          if (item) {
            setName(item.slider.name || "");
            setOrder(item.slider.order || "");
              const oldImgs = Array.isArray(item.sliderImagesd)
              ? item.sliderImagesd .map((img) => ({
                  id: img.id,
                  imagePath: img.image_path,
                }))
              : [];
            setImages(oldImgs);
            setOriginalImages(oldImgs);
          }
        })
        .catch((error) => {
          toast.error("Error fetching this User:", error);
        });
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);

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
    if (name === "order") setOrder(value);
  };
  const validateForm = () => {
    let formErrors = {};

    if (!name) formErrors.name = "Name is required";

    if (!order) formErrors.order = "Order Date is required";

    if (!images) {
      formErrors.imageuser = "Image is required";
    }
    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });

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
   
   const newUseradd = {
      name,
order: Number(order) ,
      images: images.map(b=>b.imagePath),

   };

   
    const newUser = {
      name,
order: Number(order) 
   };

     if (edit && imagesChanged) {
      const newImages = images.filter((img) => !img.id);
      const removedImages = deletedImages;

      newUser.images = [
        ...newImages.map(({ image_path }) => ({ image_path })),
        ...removedImages.map(({ id, image_path }) => ({ id, image_path })),
      ];
    }
    

    const request = edit
      ? axios.put(
          `https://app.15may.club/api/admin/sliders/${sendData}`,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : axios.post("https://app.15may.club/api/admin/sliders", newUseradd, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    request
      .then(() => {
        toast.success(`sliders ${edit ? "updated" : "added"} successfully`);
        setTimeout(() => {
          navigate("/admin/sliders");
        }, 3000);

        setName("");
        setOrder("");
        setEdit(false);
        setImages([]);
      })
      .catch((error) => {
        const err = error?.response?.data?.error;
        if (err?.details && Array.isArray(err.details)) {
          err.details.forEach((detail) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else if (err?.message) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong.");
        }
        setCheckLoading(false);
      });
  };
  
  if (loading) {
    return <Loader />;
  }
  return (
    <div className=" mt-5">
      <ToastContainer />
      <div className="flex justify-between px-2 ">
        <span className="text-3xl font-medium text-center text-four ">
          {" "}
          Slider /<span className="text-one">
            {" "}
            {edit ? "Edit " : "Add "}
          </span>{" "}
        </span>
        <button onClick={() => navigate("/admin/sliders")}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
      </div>
      <div className=" flex gap-7 flex-wrap  mt-10 px-2 space-y-5 ">
        <InputField
          placeholder="Name"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <InputField
          placeholder="Order"
          name="order"
          value={order}
          onChange={handleChange}
          email="number"
        />
        <FileUploadButtonArroy
          name="Image"
          kind="Image"
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

export default AddSliders;


