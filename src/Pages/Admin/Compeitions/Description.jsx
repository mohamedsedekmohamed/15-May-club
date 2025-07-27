import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../../UI/Loader";
import { useTranslation } from "react-i18next";

const Description = ({ID}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
      const { t, i18n } = useTranslation();
      const isRTL = i18n.language === "ar";
   useEffect(() => {
    const token = localStorage.getItem("token");
    const source = axios.CancelToken.source();
      // const { sendData } = location.state || {};

    const timeout = setTimeout(() => {
      source.cancel("Request timeout after 10 seconds.");
      setLoading(false);
      toast.error("Request timed out. Please try again.");
    }, 10000);
    axios
      .get(`https://app.15may.club/api/admin/competitions/${ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        setData(response.data.data.competition)
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeout);
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          toast.error("Error fetching data");
        }
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);
   if (loading) {
      return (
        <div className="mt-40">
          <Loader/>
        </div>
      );}
  return (
    <div>  
         <div className="flex items-start bg-white rounded-2xl shadow-md p-4 w-full gap-4">
      <img
        src={data.mainImagepath}
        alt="Image"
        className="w-24 h-24 object-cover rounded-xl"
      />
      <div className={`flex flex-col ${isRTL?"right-left":"text-left"} justify-start `}>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{data.name}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
{data.description}
        </p>
      </div>
    </div>
</div>
  )
}

export default Description