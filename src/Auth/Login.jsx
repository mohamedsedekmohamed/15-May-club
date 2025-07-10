import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { GiFalconMoon } from "react-icons/gi";
function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

 const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post('https://app.15may.club/api/admin/auth/login', {
      email: username,
      password: password
    }
  ,);

    if (response) {
      localStorage.setItem('token', response.data.data.token);
      toast.success("Welcome!");
      setTimeout(() => {
        setIsLoggedIn(true);
        navigate('/admin/home');
      }, 3000);
    } else {
      toast.error('Unauthorized access');
    }
  } catch {
    toast.error('Connection failed');
  }
};


  return (
    <div className="flex  flex-row h-screen w-full">
      <ToastContainer/>
     
     <div
        className="bg-cover bg-center bg-no-repeat h-screen w-full relative flex items-center justify-end"
        style={{ backgroundImage: "url('/loginpic.jpg')" }}
      >
 </div>

      <div className="w-full  relative flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-four">Login</h2>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-four hover:bg-four/80 text-white font-bold py-2 rounded-md transition"
          >
            Log in
          </button>
        </form>
      </div>
    </div>

  );
}
export default Login;