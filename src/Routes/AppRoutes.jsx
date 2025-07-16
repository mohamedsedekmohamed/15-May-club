import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Admin/Home/Home.jsx";
import User from "../Pages/Admin/User/User.jsx";
import AddUser from "../Pages/Admin/User/AddUser.jsx";
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Addcompetitions from "../Pages/Admin/Compeitions/AddCompeitions.jsx";
import Competitions from "../Pages/Admin/Compeitions/Compeitions.jsx"; 
import Popup from "../Pages/Admin/Popup/Popup.jsx";
import AllPopup from "../Pages/Admin/Popup/AllPopup.jsx";
import Votes from "../Pages/Admin/Votes/Votes.jsx";
import AllVotes from "../Pages/Admin/Votes/AllVotes.jsx";
import Poats from '../Pages/Admin/Postpage/Posts.jsx';
import AllPosts from '../Pages/Admin/Postpage/AllPosts.jsx'
import Complaints from "../Pages/Admin/Complaints/Complaints.jsx";
import Sliders from '../Pages/Admin/Sliders/Sliders.jsx';
import AddSliders from '../Pages/Admin/Sliders/AddSliders.jsx';
import Logout from '../Pages/Admin/Logout/Logout.jsx';
import Pending_users from '../Pages/Admin/Pending_users/Pending_users.jsx';
import Rejected_Users from '../Pages/Admin/Rejected_Users/Rejected_Users.jsx'
import AddPages from '../Pages/Admin/Popup/AddPages'
import AddCategories from '../Pages/Admin/Postpage/AddCategories';
import AllviewCompeitions from '../Pages/Admin/Compeitions/AllviewCompeitions.jsx'
import AddOptions from "../Pages/Admin/Votes/AddOptions.jsx"
import Category from '../Pages/Admin/Complaints/Category.jsx'
import AddCategory from '../Pages/Admin/Complaints/AddCategory.jsx'
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
                  <Route path="addCompetitions" element={<Addcompetitions />} />
                  <Route path="viewcompeitions" element={<AllviewCompeitions />} />
                  <Route path="popup" element={<Popup />} />
                  <Route path="allpopup" element={<AllPopup />} />
                  <Route path="addCategories" element={<AddCategories />} />
                  <Route path="addpages" element={<AddPages />} />
                  <Route path="votes" element={<Votes />} />
                  <Route path="addoptions" element={<AddOptions />} />
                  <Route path="allvotes" element={<AllVotes />} />
                  <Route path="posts" element={<Poats />} />
                  <Route path="allPosts" element={<AllPosts />} />
                  <Route path="complaints" element={<Complaints />} />  
                  <Route path="sliders" element={<Sliders />} />  
                  <Route path="addSliders" element={<AddSliders />} />
                  <Route path="addcategory" element={<AddCategory />} />
                  {/* <Route path="pending_users" element={<Pending_users />} />
                  <Route path="rejected_users" element={<Rejected_Users />} /> */}
                  <Route path="category" element={<Category />} />
                  <Route path="logout" element={<Logout />} />

          </Route>
          

      </Routes>
  )

}

export default AppRoutes