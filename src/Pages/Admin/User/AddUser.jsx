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
const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setid] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setbirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [purpose, setPurpose] = useState("");
  const [imageuser, setImageuser] = useState("");
  const [edit, setEdit] = useState(false);

  const handleFileChange = (file) => {
    if (file) setImageuser(file);
  };
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    birthdate: "",
    email: "",
    password: "",
  });

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
    if (!name) formErrors.name = "Name is required";
    if (!birthdate) formErrors.birthdate = "Birthdate is required";
    if (!phone  && phone.length < 12) {
      formErrors.phone = "Phone is required";
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone =
        'Phone should contain only numbers or start with a "+"';
    }
    if (role === "guest" && !purpose)
      formErrors.purpose = "Purpose  is required";
    if (role === "number" && !imageuser)
      formErrors.purpose = "Image  is required";
    if (!role) formErrors.gender = "role is required";
    if (!email.includes("@gmail.com"))
      formErrors.email = "Email should contain @gmail.com";
    if (!edit && password.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
    }

    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handstartDate = (newData) => {
    if (newData) {
      const formatted = newData.toISOString().split("T")[0];
      setbirthdate(formatted);
    } else {
      setbirthdate("");
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
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
    }
    if(role==="guest"){
      newUser.purpose = purpose;
    }
    if(role==="setImageuser"){
      newUser.imagePath = imageuser;
    }

    //   if (edit) {
    //     axios.put(`https://backndVoo.voo-hub.com/api/admin/user/update/${id}`, newUser, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //       .then(() => {
    //         toast.success('User updated successfully');
    //         setTimeout(() => {
    //           navigate(-1);
    //         }, 3000);
    //       })
    //       .catch((error) => {
    // const errors = error?.response?.data;

    // if (errors && typeof errors === 'object') {
    //   const firstKey = Object.keys(errors)[0];
    //   const firstMessage = errors[firstKey]?.[0];

    //   if (firstMessage) {
    //     toast.error(firstMessage);
    //   } else {
    //     toast.error("Something went wrong.");
    //   }
    // } else {
    //   toast.error("Something went wrong.");
    // }
    //   });
    //     return;
    //   }

    axios
      .post("https://app.15may.club/api/admin/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("User added successfully");
        setTimeout(() => {
          navigate(-1);
        }, 3000);
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
        const errors = error?.response?.data;

        if (errors && typeof errors === "object") {
          const firstKey = Object.keys(errors)[0];
          const firstMessage = errors[firstKey]?.[0];

          if (firstMessage) {
            toast.error(firstMessage);
          } else {
            toast.error("Something went wrong.");
          }
        } else {
          toast.error("Something went wrong.");
        }
      });

    //   if (loading) {
    //   return (
    //     <Loader/>
    //   );
    // }
  };
  return (
    <div className=" mt-5">
      <ToastContainer />
      <span className="text-3xl font-medium text-center text-four "> User /<span className="text-one"> {edit?"Edit ":"Add "}</span> </span>
      <div className=" flex gap-7 flex-wrap  mt-6 pr-5 space-y-5 ">
        <InputField
          placeholder="User"
          name="name"
          value={name}
          onChange={handleChange}
        />
          <InputField
          placeholder="Phone"
          name="phone"
          value={phone}
          onChange={handleChange}
        />
        <InputField
          placeholder="Gmail"
          name="email"
          value={email}
          onChange={handleChange}
        />
          <InputField
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <Inputfiltter
          placeholder="Role"
          name="role"
          value={role}
          like
          onChange={handleChange}
        />
      
          <div className="relative flex flex-col  h-[50px] ">
            <FaRegCalendarAlt className="absolute top-[60%] right-10 transform -translate-y-1/2 text-one z-10" />
            <DatePicker
              selected={birthdate}
              onChange={handstartDate}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
              className=" w-[300px]  h-[60px]  border-1  border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>
      
    
      </div>
        {role ==="number" &&(
        <FileUploadButton
           name="Image"
           kind="Image"
           flag={imageuser}
           onFileChange={handleFileChange}
        />
      )}
      {role ==="guest" &&(
         <InputField
          placeholder="Purpose"
          name="purpose"
          value={purpose}
          onChange={handleChange}
        />
      )}
      <div className="flex mt-6">
        <button
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-[16px]"
          onClick={handleSave}
        >
          {edit?"Edit ":"Add "}
        </button>
      </div>
    </div>
  );
};

export default AddUser;
