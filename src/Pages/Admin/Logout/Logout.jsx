import { useNavigate } from "react-router-dom";

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem("token");
      sessionStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      navigate("/", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full h-full flex justify-center items-center px-4 py-2 text-white"
    >
      <span className="bg-one px-4 py-2 rounded-2xl"> Log Out</span>
    </button>
  );
};

export default Logout;
