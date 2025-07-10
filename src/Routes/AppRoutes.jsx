import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Admin/Home/Home.jsx";
import User from "../Pages/Admin/User/User.jsx";
import AddUser from "../Pages/Admin/User/AddUser.jsx";
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Addcompetitions from "../Pages/Admin/Compeitions/AddCompeitions.jsx";
import Competitions from "../Pages/Admin/Compeitions/Compeitions.jsx"; 
import Popup from "../Pages/Admin/Popup/Popup.jsx";
import Addpopup from "../Pages/Admin/Popup/Addpopup.jsx";
import Votes from "../Pages/Admin/Votes/Votes.jsx";
import AddVotes from "../Pages/Admin/Votes/AddVotes.jsx";
import Poats from '../Pages/Admin/Postpage/Posts.jsx';
import AddPost from '../Pages/Admin/Postpage/AddPost.jsx'
import Complaints from "../Pages/Admin/Complaints/Complaints.jsx";
import Sliders from '../Pages/Admin/Sliders/Sliders.jsx';
import AddSliders from '../Pages/Admin/Sliders/AddSliders.jsx';
import Logout from '../Pages/Admin/Logout/Logout.jsx';
import Pending_users from '../Pages/Admin/Pending_users/Pending_users.jsx';
import Rejected_Users from '../Pages/Admin/Rejected_Users/Rejected_Users.jsx'
const AppRoutes = () => {
  return (
  <Routes>
      <Route path="/" element={<Navigate to="/admin/home" />} />  
        <Route path="*" element={<Navigate to="/admin/home" replace />} />

          <Route path="/admin" element={<AdminLayout />}>
                  <Route path="home" element={<Home/>} />
                  <Route path="user" element={<User />} />
                  <Route path="addUser" element={<AddUser />} />
                  <Route path="competitions" element={<Competitions />} />
                  <Route path="addcompetitions" element={<Addcompetitions />} />
                  <Route path="popup" element={<Popup />} />
                  <Route path="addpopup" element={<Addpopup />} />
                  <Route path="votes" element={<Votes />} />
                  <Route path="addVotes" element={<AddVotes />} />
                  <Route path="posts" element={<Poats />} />
                  <Route path="addPost" element={<AddPost />} />
                  <Route path="complaints" element={<Complaints />} />  
                  <Route path="sliders" element={<Sliders />} />  
                  <Route path="addSliders" element={<AddSliders />} />
                  <Route path="pending_users" element={<Pending_users />} />
                  <Route path="rejected_users" element={<Rejected_Users />} />
                  <Route path="logout" element={<Logout />} />

          </Route>
          

      </Routes>
  )

}

export default AppRoutes