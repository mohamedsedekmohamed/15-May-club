import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Admin/Home/Home.jsx";
import User from "../Pages/Admin/User/User.jsx";
import AddUser from "../Pages/Admin/User/AddUser.jsx";
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Addcompetitions from "../Pages/Admin/Compeitions/AddCompeitions.jsx";
import Competitions from "../Pages/Admin/Compeitions/Compeitions.jsx"; 
import Popup from "../Pages/Admin/Popup/Popup.jsx";
import AddPopuo from "../Pages/Admin/Popup/Addpopup.jsx";
import Pages from '../Pages/Admin/Pages/Pages.jsx'
import Votes from "../Pages/Admin/Votes/Votes.jsx";
import AddVotes from "../Pages/Admin/Votes/AddVotes.jsx";
import Poats from '../Pages/Admin/Postpage/Posts.jsx';
import Complaints from "../Pages/Admin/Complaints/Complaints.jsx";
import Sliders from '../Pages/Admin/Sliders/Sliders.jsx';
import AddSliders from '../Pages/Admin/Sliders/AddSliders.jsx';
import Options from '../Pages/Admin/Options/Options.jsx';
import AddPages from '../Pages/Admin/Pages/AddPages.jsx'
import Categories from '../Pages/Admin/Categories/Categories.jsx';
import AddCategories from '../Pages/Admin/Categories/AddCategories.jsx';
import AllviewCompeitions from '../Pages/Admin/Compeitions/AllviewCompeitions.jsx'
import AddOptions from "../Pages/Admin/Options/AddOptions.jsx"
import Category from '../Pages/Admin/Complaints/Category.jsx'
import AddCategory from '../Pages/Admin/Complaints/AddCategory.jsx'
import Notifications from '../Pages/Admin/Notifications/Notifications.jsx'
import AddNotifications from '../Pages/Admin/Notifications/AddNotifications.jsx'
import Information from "../Component/Information.jsx"
import AddInformation from "../Component/AddInformation.jsx"
import AddPost from '../Pages/Admin/Postpage/AddPost.jsx';
import AddNumbers from '../Pages/Admin/Numbers/AddNumbers.jsx';
import Numbers from '../Pages/Admin/Numbers/Numbers.jsx';
// import Banner from '../Pages/Admin/Banner/Banner.jsx'
// import AddBanners from '../Pages/Admin/Banner/AddBanner.jsx'
import { useTranslation } from 'react-i18next';
import '../translation/i18n'; 
const AppRoutes = ({setIsLoggedIn}) => {
       const {  i18n } = useTranslation();
useEffect(() => {
  const storedLang = localStorage.getItem('language');
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
  const langToUse = storedLang || browserLang;

  if (i18n.language !== langToUse) {
    i18n.changeLanguage(langToUse);
  }

  // حفظ اللغة المختارة
  if (!storedLang) {
    localStorage.setItem('language', langToUse);
  }

  // ✅ تغيير الاتجاه حسب اللغة
  document.body.dir = langToUse === 'ar' ? 'rtl' : 'ltr';

}, []);
  

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
                  <Route path="addpopup" element={<AddPopuo />} />
                  {/* <Route path="pages" element={<Pages />} /> */}
                  
                  <Route path="addcategories" element={<AddCategories />} />
                  <Route path="categories" element={<Categories />} />
                  {/* <Route path="addpages" element={<AddPages />} /> */}
                  <Route path="votes" element={<Votes />} />

                  {/* <Route path="options" element={<Options />} /> */}
                  {/* <Route path="addoptions" element={<AddOptions />} /> */}
                  <Route path="addvotes" element={<AddVotes />} />

                  <Route path="posts" element={<Poats />} />
                  <Route path="addpost" element={<AddPost />} />

                  <Route path="complaints" element={<Complaints />} />  
                  <Route path="sliders" element={<Sliders />} />  
                  <Route path="addSliders" element={<AddSliders />} />
                  <Route path="addcategory" element={<AddCategory />} />
                   <Route path="information" element={<Information  setIsLoggedIn={setIsLoggedIn} />} />
                   <Route path="addInformation" element={<AddInformation/>} />
                  <Route path="category" element={<Category />} />

                  <Route path="notifications" element={<Notifications />} />
                  <Route path="addnotifications" element={<AddNotifications />} />
                   
                  {/* <Route path="banner" element={<Banner />} /> */}
                  {/* <Route path="addbanner" element={<AddBanners />} /> */}

                  <Route path="members" element={<Numbers />} />
                  <Route path="addmembers" element={<AddNumbers />} />
          </Route>
          

      </Routes>
  )

}

export default AppRoutes