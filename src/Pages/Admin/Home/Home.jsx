import React, { useEffect, useState } from "react";
import Loader from "../../../UI/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PieChartComponent from '../../../UI/PieChartComponent'
import { useNavigate } from "react-router-dom";
import { BsPostageFill } from "react-icons/bs";
import { AiOutlinePicture } from "react-icons/ai";
import { TfiLayoutSliderAlt } from "react-icons/tfi";

const Home = () => {
  const [data, setData] = useState({});
  const [supdata, setSupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [headerRes, rejectRes] = await Promise.all([
          axios.get("https://app.15may.club/api/admin/dashboard/header", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://app.15may.club/api/admin/dashboard/rejectUsers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setData(headerRes.data.data);
        setSupData(
          rejectRes.data.data.users.map((item) => ({
            name: item.name,
            rejectionReason: item.rejectionReason,
            rejectDate: item.rejectDate,
          }))
        );
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-wrap gap-5 px-5 pt-5">
        {[
          { label: "User", value: data.userCount },
          { label: "Complaint", value: data.complaintCount },
          { label: "Competitions", value: data.competitionsCount },
          { label: "Votes", value: data.votesCount },
          { label: "Posts", value: data.postsCount },
          { label: "Popups", value: data.popupsCount },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col p-4 w-[170px] h-[100px] gap-2 bg-gray-200/70 rounded-2xl shadow"
          >
            <span className="text-sm font-medium text-gray-600">{item.label}</span>
            <span className="text-lg font-bold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
<div className="flex flex-col md:flex-row gap-3">
<div className="flex flex-col items-center gap-2 px-2 text-white">
<button className="bg-one w-50 rounded-4xl py-2 flex gap-2 justify-center items-center" onClick={()=>{navigate("/admin/allPosts")}}><span>Add Posts</span><BsPostageFill/></button>
<button className="bg-one w-50 rounded-4xl py-2 flex gap-2 justify-center items-center" onClick={()=>{navigate("/admin/allpopup")}}><span>Add Popup</span><AiOutlinePicture/></button>
<button className="bg-one w-50 rounded-4xl py-2 flex gap-2 justify-center items-center" onClick={()=>{navigate("/admin/addSliders")}}><span>Add Sliders</span><TfiLayoutSliderAlt/></button>
</div>
<PieChartComponent/>
</div>
      <div className="px-5">
        <h2 className="text-xl font-semibold text-one mb-2">Rejected Users</h2>
        {supdata.length > 0 ? (
          supdata.map((data, index) => (
            <div key={index} className="my-2 bg-three p-3 text-sm text-gray-700">
              <span>{data.name} - {data.rejectionReason} - {data.rejectDate}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No rejected users found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
