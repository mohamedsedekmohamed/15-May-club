import React, { useEffect, useState } from "react";
import DynamicTable from '../../../Component/DynamicTable';
import Pagination from "@mui/material/Pagination";
import { useNavigate,useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavAndSearch from '../../../Component/NavAndSearch';
import { CiSearch, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";

const Popup = () => {
    const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const مocation = useLocation();
const handleStatusFilterChange = (status) => {
  setStatusFilter((prev) =>
    prev.includes(status)
      ? prev.filter((s) => s !== status)
      : [...prev, status]
  );
};
  useEffect(() => {
    setUpdate((prev) => !prev);
  }, [location.pathname]);
 useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
 useEffect(() => {
  const token = localStorage.getItem("token");
  const source = axios.CancelToken.source();

  const fetchTwice = async () => {
    setLoading(true);

    const timeout = setTimeout(() => {
      source.cancel("Request timeout after 10 seconds.");
      setLoading(false);
      toast.error("Request timed out. Please try again.");
    }, 10000);

    try {
      // الطلب الأول (مش هنخزن نتيجته)
      await axios.get("https://app.15may.club/api/admin/popups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      });

      // الطلب الثاني (هو اللي هنعرضه)
      const response2 = await axios.get("https://app.15may.club/api/admin/popups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      });

      clearTimeout(timeout);
      setData(response2.data.data.popups);
      setLoading(false);
    } catch (error) {
      clearTimeout(timeout);
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        toast.error("Error fetching data");
      }
      setLoading(false);
    }
  };

  fetchTwice();

  return () => {
    source.cancel(); // إلغاء الطلب لو خرجنا من الصفحة
  };
}, [update]);


  const handleEdit = (id) => {
    navigate("/admin/addpopup", { state: { sendData: id  } });
  };
    const handleDelete = (Id, userName) => {
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
            `https://app.15may.club/api/admin/popups/${Id}`,
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
  { key: "imagePath", label: "image" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "status", label: "Status" },
];

const filteredData = data.filter((item) => {
  const query = searchQuery.toLowerCase();

  const matchesSearch =
    selectedFilter === ""
      ? Object.values(item || {}).some((value) =>
          typeof value === "object" && value !== null
            ? Object.values(value || {}).some((sub) =>
                sub?.toString().toLowerCase().includes(query)
              )
            : value?.toString().toLowerCase().includes(query)
        )
      : (() => {
          const keys = selectedFilter.split(".");
          let value = item;
          for (let key of keys) value = value?.[key];
          return value?.toString().toLowerCase().includes(query);
        })();

  const matchesStatus =
    statusFilter.length === 0 || statusFilter.includes(item.status);

  return matchesSearch && matchesStatus;
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
const handleToggleStatus = (row) => {
  const newStatus = row.status === "active" ? "disabled" : "active";
  const token = localStorage.getItem("token");
 const newUser = {
      title:row.title,
      startDate:row.startDate,
      endDate:row.endDate,
      status:newStatus,
    };
  axios
    .put(`https://app.15may.club/api/admin/popups/${row.id}`, 
newUser
    , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      toast.success("Status updated successfully");
      setUpdate(prev => !prev);
    })
    .catch(() => {
      toast.error("Failed to update status");
    });
};

  return (
    <div>
      <NavAndSearch nav="/admin/addpopup" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
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
   buttonstatus={(row) => (
    <div className="flex gap-1">
<td>
  <label className="flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={row.status === "active"}
      onChange={() => handleToggleStatus(row)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer relative after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded-full after:left-0.5 after:top-0.5 after:transition-all peer-checked:after:translate-x-full" />
  </label>
</td>
     

    </div>
  )}
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
 
  customRender={(key, value) =>
    key === "imagePath" ? (
      <img
        src={value}
        alt="popup"
        className="w-16 h-16 object-cover rounded"
      />
    ) : null
  }
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
      <ToastContainer/>
    </div>
  )
}


export default Popup