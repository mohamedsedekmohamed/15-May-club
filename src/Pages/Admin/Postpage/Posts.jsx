import DynamicTable from '../../../Component/DynamicTable';
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavAndSearch from '../../../Component/NavAndSearch';
import { CiSearch, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";

const Posts = () => {
    const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");


  const navigate = useNavigate();


 useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
  const token = localStorage.getItem("token");
  const source = axios.CancelToken.source(); 

  const timeout = setTimeout(() => {
    source.cancel("Request timeout after 10 seconds.");
    setLoading(false);
    toast.error("Request timed out. Please try again.");
  }, 10000);

  axios
    .get("https://app.15may.club/api/admin/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    })
    .then((response) => {
      clearTimeout(timeout); 
setData(
  response.data.data.posts.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.images[0],
  }))
);
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
}, [update]);
 const handleEdit = (id) => {
    navigate("/admin/addpost", { state: { sendData: id } });
  };
     const handleDelete = (userId, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://app.15may.club/api/admin/posts/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate(!update);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success"
            );
          })
          .catch(() => {
            Swal.fire(
              "Error!",
              `There was an error while deleting ${userName}.`,
              "error"
            );
          });
      } else {
        Swal.fire("Cancelled", `${userName} was not deleted.`, "info");
      }
    });
  };
  
const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
    { key: "image", label: "Image" }, 


];

const filteredData = data.filter((item) => {
  const query = searchQuery.toLowerCase();


  const matchesSearch =
    selectedFilter === ""
      ? Object.entries(item || {}).some(([key, value]) => {
         

          if (typeof value === "object" && value !== null) {
            return Object.values(value || {}).some((sub) =>
              sub?.toString().toLowerCase().includes(query)
            );
          }

          return value?.toString().toLowerCase().includes(query);
        })
      : (() => {
          const keys = selectedFilter.split(".");
          let value = item;
          for (let key of keys) value = value?.[key];
          return value?.toString().toLowerCase().includes(query);
        })();

  return matchesSearch;
});




    const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
 
   if (loading) {
      return (
        <Loader/>
      );}

  return  (
    <div>
      <NavAndSearch nav="/admin/addpost" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>


     
    <DynamicTable
  data={paginatedData}
  columns={columns}
  rowsPerPage={rowsPerPage}
  currentPage={currentPage}
  actions={(row) => (
    <div className="flex gap-1">
      <CiEdit
        className="w-[24px] h-[24px] text-green-600 cursor-pointer"
        onClick={() => handleEdit(row.id)}
      />
      <RiDeleteBin6Line
        className="w-[24px] h-[24px] ml-2 text-red-600 cursor-pointer"
        onClick={() => handleDelete(row.id, row.title)}
      />
    </div>
  )}
  customRender={(key, value) => {
    if (key === "image") {
      return (
        <img
          src={value}
          alt="Slider"
          className="w-20 h-12 object-cover rounded"
        />
      );
    }

  

    return null;
  }}
/>

  
          <div className="flex justify-center mt-4">
       <Pagination
  count={pageCount}
  page={currentPage}
  onChange={(e, page) => setCurrentPage(page)}
  shape="rounded"
  sx={{
    '& .MuiPaginationItem-root': {
      color: '#876340', // لون النص
      borderColor: '#876340',
    },
    '& .Mui-selected': {
      backgroundColor: '#876340',
      color: 'white',
      '&:hover': {
        backgroundColor: '#5d4037', // بني أغمق عند التمرير
      },
    },
  
  }}
/>

      </div>
    </div>
  )
}

export default Posts