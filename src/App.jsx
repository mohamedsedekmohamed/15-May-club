import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login.jsx";
import AppRoutes from "./Routes/AppRoutes.jsx";
import { useEffect, useState } from "react";
import LandPage from "./LandPage/LandPage.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = sessionStorage.getItem("isLoggedIn");
    return stored === "true";
  });
    useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn ]);

  return (
    <div className=" h-screen overflow-x-hidden  bg-gray-50">
      
      <BrowserRouter>
        <Routes>
          {!isLoggedIn ? (
            <>
             <Route
                path="/"
                element={<LandPage  />}
              />
              <Route
                path="/login"
                element={
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                  />
                }/>
                  <Route
                path="/*"
                element={<LandPage  />}
              />
            </>
          ) : (
            <>
           
            <Route
                path="/*"
                element={<AppRoutes setIsLoggedIn={setIsLoggedIn} />}
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
