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

const Sliders = () => {
    const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
      const [statusFilter, setStatusFilter] = useState([]);
  const handleStatusFilterChange = (status) => {
  setStatusFilter((prev) =>
    prev.includes(status)
      ? prev.filter((s) => s !== status)
      : [...prev, status]
  );
};

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
    .get("https://app.15may.club/api/admin/sliders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    })
    .then((response) => {
      clearTimeout(timeout); 
setData(
  response.data.data.sliders.map((item) => ({
    id: item.id,
    name: item.name,
status: item.status,
    order: item.order,
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
    navigate("/admin/addSliders", { state: { sendData: id } });
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
            `https://app.15may.club/api/admin/sliders/${userId}`,
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
  { key: "name", label: "Name" },
  { key: "order", label: "Order" },
  { key: "image", label: "Image" }, 
  { key: "status", label: "Status" },


];

const filteredData = data.filter((item) => {
  const query = searchQuery.toLowerCase();

  const statusText = item.status === false || item.status === 0 ? "disabled" : "active";
  const matchesStatus =
    statusFilter.length === 0 || statusFilter.includes(statusText);

  const matchesSearch =
    selectedFilter === ""
      ? Object.entries(item || {}).some(([key, value]) => {
          if (key === "status") {
            const text = value === false || value === 0 ? "disabled" : "active";
            return text.toLowerCase().includes(query);
          }

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

  return matchesStatus && matchesSearch;
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
      <NavAndSearch nav="/admin/addSliders" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
   <div className="flex gap-4 justify-end flex-wrap mt-4 mb-2 px-4">
  {[
    { label: "Active", value: "active", color: "text-one" },
    { label: "Disabled", value: "disabled", color: "text-one/50" },
  ].map(({ label, value, color }) => (
    <label
      key={value}
      className={`flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-full cursor-pointer transition-all duration-200 hover:shadow-sm ${color}`}
    >
      <input
        type="checkbox"
        value={value}
        checked={statusFilter.includes(value)}
        onChange={() => handleStatusFilterChange(value)}
        className="form-checkbox accent-current w-4 h-4"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  ))}
</div>

     
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
        onClick={() => handleDelete(row.id, row.name)}
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

    if (key === "status") {
      return (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            value === 1
              ? "bg-green-100 text-one font-light"
              : "bg-red-100 text-one/90"
          }`}
        >
          {value === 0 ? "Active" : "Disabled"}
        </span>
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

export default Sliders