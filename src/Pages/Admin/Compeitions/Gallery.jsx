import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../../UI/Loader";
const Gallery = ({ID}) => {
       const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
   useEffect(() => {
    const token = localStorage.getItem("token");
    const source = axios.CancelToken.source();

    const timeout = setTimeout(() => {
      source.cancel("Request timeout after 10 seconds.");
      setLoading(false);
      toast.error("Request timed out. Please try again.");
    }, 10000);
    axios
      .get(`https://app.15may.club/api/admin/competitions/${ID}/images`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        setData(response.data.data.images_url.map((item)=>({
            image:item.image_path
        })))
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
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((src, index) => (
        <img
          key={index}
          src={src.image}
          alt={`Image ${index + 1}`}
          className="w-[250px] h-[300px] object-cover rounded-xl shadow"
        />
      ))}
    </div>
    </div>
  )
}

export default Gallery