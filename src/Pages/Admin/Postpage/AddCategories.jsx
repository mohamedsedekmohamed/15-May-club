import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../../../UI/InputField";
import Loader from "../../../UI/Loader";
import { GiFastBackwardButton } from "react-icons/gi";

const AddCategories = () => {
  const navigate = useNavigate();
      const location = useLocation();
      const { sendData } = location.state || {};
      const [edit, setEdit] = useState(false);
      const [checkLoading, setCheckLoading] = useState(false);
      const [loading, setLoading] = useState(true);
        const [name, setName] = useState("");
       const [errors, setErrors] = useState({
          name: "",
        });
        useEffect(() => {
    if (sendData) {
      setEdit(true);

      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/posts/categories/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const item = response.data.data.category;
          if (item) {
            setName(item.name || "");
          
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
    const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
  };
  const validateForm = () => {
      let formErrors = {};
  
      if (!name) formErrors.name = "Name is required";
      
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
      name,
    };

  
    const request = edit
      ? axios.put(
          `https://app.15may.club/api/admin/posts/categories/${sendData}`,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : axios.post("https://app.15may.club/api/admin/posts/categories", newUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    request
      .then(() => {
        toast.success(`Categories ${edit ? "updated" : "added"} successfully`);
        setTimeout(() => {
    navigate("/admin/allposts", { state: { sendData: "Posts" } });
        }, 3000);

        setName("");
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
           <button onClick={() =>  navigate("/admin/allposts", { state: { sendData: "Posts" } })}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
        <span className="text-3xl font-medium text-center text-four ">
          {" "}
          Categories /<span className="text-one">
            {" "}
            {edit ? "Edit " : "Add "}
          </span>{" "}
        </span>

    
      </div>
      <div className=" flex gap-7 flex-wrap  mt-10 pr-5 space-y-5 ">
        <InputField
          placeholder="Name"
          name="name"
          value={name}
          onChange={handleChange}
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

export default AddCategories