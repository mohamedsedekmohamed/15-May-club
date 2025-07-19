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

const AddUser = () => {
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
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    birthdate: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (sendData) {
      setEdit(true);

      const token = localStorage.getItem("token");
      axios
        .get(`https://app.15may.club/api/admin/users/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

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

    if (!name) formErrors.name = "Name is required";

    if (!birthdate) formErrors.birthdate = "Birthdate is required";

    if (!phone) {
      formErrors.phone = "Phone is required";
    } else if (!/^01\d{9}$/.test(phone)) {
      formErrors.phone = "Phone must start with 01 and be 11 digits long";
    }

    if (role === "guest" && !purpose) {
      formErrors.purpose = "Purpose is required";
    }

    if (role === "number" && !imageuser) {
      formErrors.imageuser = "Image is required";
    }

    if (!role) formErrors.gender = "Role is required";

    if (!email.includes("@gmail.com")) {
      formErrors.email = "Email should contain @gmail.com";
    }

    if (!edit && (!password || password.length < 8)) {
      formErrors.password = "Password must be at least 8 characters";
    }

    // Show all error messages
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
      if (role === "guest") {
        newUser.purpose = purpose;
      }
      if (role === "member") {
        newUser.imageBase64 = imageuser;
      }
    } else {
      if (password && password.length >= 8) {
        newUser.password = password;
      }

      if (role === "member" && imageuser && !imageuser.startsWith("/uploads")) {
        newUser.imagePath = imageuser;
      }

      if (role === "guest") {
        newUser.purpose = purpose;
      }
    }

    const request = edit
      ? axios.put(
          `https://app.15may.club/api/admin/users/${sendData}`,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : axios.post("https://app.15may.club/api/admin/users", newUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    request
      .then(() => {
        toast.success(`User ${edit ? "updated" : "added"} successfully`);
        setTimeout(() => {
          navigate("/admin/user");
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
    <div className=" mt-5 px-2">
      <ToastContainer />
      <div className="flex gap-5 px-2 ">
        <button className="" onClick={() => navigate("/admin/user")}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
        <span className="text-3xl font-medium text-center text-four ">
          {" "}
          User /<span className="text-one">
            {" "}
            {edit ? "Edit " : "Add "}
          </span>{" "}
        </span>
       
      </div>
      <div className=" flex gap-7 flex-wrap  mt-10 pr-5 space-y-5 ">
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
            className=" w-[280px]  h-[60px]  border-1  border-four focus-within:border-one rounded-[16px] placeholder-one pl-5"
            showYearDropdown
            scrollableYearDropdown  maxDate={new Date()}
            yearDropdownItemNumber={100}
          />
        </div>
      </div>
      <div className="mt-10 md:mt-5">
        {role === "member" && (
          <FileUploadButton
            name="Image"
            kind="Image"
            flag={imageuser}
            onFileChange={handleFileChange}
          />
        )}
        {role === "guest" && (
          <InputField
            placeholder="Purpose"
            name="purpose"
            value={purpose}
            onChange={handleChange}
          />
        )}
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

export default AddUser;
