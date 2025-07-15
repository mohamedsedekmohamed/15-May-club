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
    const [imageuser, setImageuser] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    // const [categoryId, setcCategoryId] = useState([]);
    const [errors, setErrors] = useState({
      title: "",
      categoryId: "",
    });
      useEffect(() => {
        console.log(sendData)
    if (sendData) {
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
   const handleFileChange = (file) => {
    if (file) setImageuser(file);
  };
    const validateForm = () => {
      let formErrors = {};
  
      if (!title) formErrors.title = "Title is required";  
      if(!category)formErrors.categoryId="Category is required"
      if (!imageuser) {
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
    const newUser = {
      title,
      categoryId:category
    };

    if (!edit) {
      if (imageuser && !imageuser.startsWith("/uploads")) {
        newUser.imagePath = imageuser;
      }
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
      : axios.post("https://app.15may.club/api/admin/posts", newUser, {
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

        setTitle("");
        setEdit(false);
        setImageuser(null);
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
//  useEffect(() => {
//     const token = localStorage.getItem("token");
//     axios
//       .get(`https://app.15may.club/api/admin/posts/categories`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         const item = response.data.data;
//         if (item) {
//           setcCategoryId(item.categories || "");
//         }
//       })
//       .catch((error) => {
//         toast.error("Error fetching this User:", error);
//       });
//   }, []);

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
      <div className="flex justify-between pr-10 ">
        <span className="text-3xl font-medium text-center text-four ">
          {" "}
          Posts /<span className="text-one">
            {" "}
            {edit ? "Edit " : "Add "}
          </span>{" "}
        </span>
        <button onClick={() => navigate("/admin/posts")}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
      </div>
      <div className=" flex gap-7 flex-wrap  mt-10 pr-5 space-y-5 ">
        <InputField
          placeholder="Title"
          name="title"
          value={title}
          onChange={handleChange}
        />

   
      
        <FileUploadButtonArroy
          name="Image"
          kind="Image"
          flag={imageuser}
          onFileChange={handleFileChange}
        />
        <InputArrow
        name="posts/categories"
          value={category}
          onChange={setCategory}
          placeholder="Select Pages"
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