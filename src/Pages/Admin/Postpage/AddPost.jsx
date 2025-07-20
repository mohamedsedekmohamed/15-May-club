import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../UI/InputField";
import InputArrow from "../../../UI/InputArrow";
import FileUploadButtonArroy from "../../../UI/FileUploadButtonArroy";
import MultiSelectField from "../../../UI/MultiSelectField";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";

const AddPost = () => {
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

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    // useEffect(()=>{
    //   console.log(category.target.value)
    // },[category])
    const [errors, setErrors] = useState({
      title: "",
      categoryId: "",
    });
      useEffect(() => {
        console.log(sendData)
    if (sendData  && sendData!=="Posts") {
      setEdit(true);

      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/posts/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const item = response.data.data;
          if (item) {
            setTitle(item.post.title || "");
            setCategory(item.post.categoryId || "");
              const oldImgs = Array.isArray(item.images)
              ? item.images .map((img) => ({
                  id: img.id,
                  imagePath: img.imagePath,
                }))
              : [];
            setImages(oldImgs);
            setOriginalImages(oldImgs);
          }
        })
        .catch((error) => {
          toast.error("Error fetching this posts:", error);
        });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
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
    const validateForm = () => {
      let formErrors = {};
  
      if (!title) formErrors.title = "Title is required";  
      if(!category)formErrors.categoryId="Category is required"
      if (!images|| images.length===0) {
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
      title,
      categoryId:category,
        images: images.map(b=>b.imagePath),
    };
    const newUser = {
      title,
      categoryId:category
    };
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
          `https://app.15may.club/api/admin/posts/${sendData}`,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : axios.post("https://app.15may.club/api/admin/posts", newUseradd, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    request
      .then(() => {
        toast.success(`posts ${edit ? "updated" : "added"} successfully`);
        setTimeout(() => {
          navigate("/admin/posts");
        }, 3000);

     setImages([])
setDeletedImages([])
   setImagesChanged(false)
   setOriginalImages([])
setCategory('')

        setTitle("");
        setEdit(false);
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
    return (

      <div className="mt-40">
      <Loader />

    </div>
    )
  }
  return (
  <div className=" mt-5">
      <ToastContainer />
      <div className="flex gap-5 px-2 ">
         <button onClick={() => navigate("/admin/posts")}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
        <span className="text-3xl font-medium text-center text-four ">
          {" "}
          Posts /<span className="text-one">
            {" "}
            {edit ? "Edit " : "Add "}
          </span>{" "}
        </span>
       
      </div>
      <div className=" flex gap-7 flex-wrap  mt-10  space-y-5 ">
        <InputField
          placeholder="Title"
          name="title"
          value={title}
          onChange={handleChange}
        />

    <InputArrow
        name="posts/categories"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          placeholder="Select Categories"
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
    </div>  )
}

export default AddPost