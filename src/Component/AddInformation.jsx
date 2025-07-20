import React, { useEffect, useState } from 'react';
import InputField from '../UI/InputField';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../UI/Loader';
import { GiFastBackwardButton } from "react-icons/gi";
import FileUploadButton from '../UI/FileUploadButton'
const AddInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [picAdmin,setPicAdmin]=useState(null)
  const [check,setCheck]=useState(null)
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
 
  const handleFileChange = (file) => {
    if (file) setPicAdmin(file);
  };
  useEffect(() => {
  
      const token = localStorage.getItem('token');
      axios.get("https://app.15may.club/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const user = response.data.data
            setName(user.name || '');
            setPhone(user.phoneNumber || '');
            setEmail(user.email || '');
            setPicAdmin(user.imagePath || '');
            setCheck(user.imagePath || '');
        })
        .catch(error => {
          console.error("Error fetching user:", error);
        });
  
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'phone') setPhone(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = 'Name is required';
    // if (!password || password.length>=8) formErrors.password = 'password is required and 8 char';
    if (!phone) {
      formErrors.phone = 'Phone is required';
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone = 'Phone should contain only numbers or start with a "+"';
    }
    if (!email.includes('@gmail.com')) formErrors.email = 'Email should contain @gmail.com';
   
    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }


    const token = localStorage.getItem('token');
    const newUser = {
      name,
      phoneNumber:phone,
      email,
    };
     if ( picAdmin==!check||!picAdmin.startsWith("/uploads") ) {
        newUser.imagePath = picAdmin;
      }

    if(password){
      newUser.password=password
    }
      axios.put(`https://app.15may.club/api/admin/profile`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success('Admin updated successfully');
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        setCheck(null)  
        setPicAdmin(null)
    setName('');
    setPhone('');
    setEmail('');
    setPassword('');
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
      });
   

  };


  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <div>
      <ToastContainer/>
      <div className=' flex gap-1.5'>
<button onClick={() =>  navigate("/admin/information")}>
          {" "}
          <GiFastBackwardButton className="text-one text-3xl" />{" "}
        </button>
<h1 className='w-full  font-medium text-3xl text-one py-4'>Edit Admin</h1>
 
      </div>
      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="Admin"
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
       
             <FileUploadButton
            name="Image"
            kind="Image"
            flag={picAdmin}
            onFileChange={handleFileChange}
          />
          <InputField
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
      </div>

      <div className="flex mt-6">
        <button className='transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl' onClick={handleSave}>
          Done
        </button>
      </div>
    </div>
  );
};



export default AddInformation