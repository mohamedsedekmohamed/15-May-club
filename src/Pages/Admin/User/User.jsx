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

const User = () => {
    const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
const handleStatusFilterChange = (status) => {
  setStatusFilter((prev) =>
    prev.includes(status)
      ? prev.filter((s) => s !== status)
      : [...prev, status]
  );
};

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
    .get("https://app.15may.club/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    })
    .then((response) => {
      clearTimeout(timeout); 
      setData(response.data.data.users);
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

//  const handleChange = (e) => {
//     setSelectedFilter(e.target.value);
//   };


  const handleEdit = (id) => {
    navigate("/admin/addUser", { state: { sendData: id } });
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
            `https://app.15may.club/api/admin/users/${userId}`,
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
  { key: "phoneNumber", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "dateOfBirth", label: "date Birth" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "purpose", label: "Purpose" },
];
  const approve = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to accept ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://app.15may.club/api/admin/users/${id}/approve`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Accepted!", `${userName} has been accepted.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to accept ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not accepted.`, "info");
      }
    });
  };

 const reject = (id, userName) => {
  const token = localStorage.getItem("token");

  Swal.fire({
    title: `Are you sure you want to reject ${userName}?`,
    input: 'textarea',
    inputLabel: 'Rejection Reason',
    inputPlaceholder: 'Write the reason here...',
    inputAttributes: {
      'aria-label': 'Rejection reason',
    },
    showCancelButton: true,
    confirmButtonText: 'Yes, reject',
    cancelButtonText: 'Cancel',
    icon: 'warning',
    preConfirm: (reason) => {
      if (!reason) {
        Swal.showValidationMessage('Please enter a reason');
      }
      return reason;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const rejectionReason = result.value;

      axios
        .put(
          `https://app.15may.club/api/admin/users/${id}/reject`,
          { rejectionReason },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setUpdate((prev) => !prev);
          Swal.fire("Rejected!", `${userName} has been rejected.`, "success");
        })
        .catch(() => {
          Swal.fire("Error!", `Failed to reject ${userName}.`, "error");
        });
    } else {
      Swal.fire("Cancelled", `The rejection was cancelled.`, "info");
    }
  });
};

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

  return (
    <div>
      <ToastContainer/>
      <NavAndSearch nav="/admin/addUser" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
  <div className="flex gap-4 justify-end flex-wrap mt-4 mb-2 px-4">
  {[
    { label: "Approved", value: "approved", color: "text-one" },
    { label: "Pending", value: "pending", color: "text-one/50" },
    { label: "Rejected", value: "rejected", color: "text-one/70" },
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
       <div className='flex gap-1'>
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
        actionsstates={(row) => (
       <select
                      className="text-sm border px-2 py-1 rounded-4xl  bg-one text-white"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "approve") {
                          approve(row.id,row.name);
                        } else if (value === "reject") {
                          reject(row.id, row.name)
                        }
                      }}
                      defaultValue="select"
                    >
                      <option value="select">select</option>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                    </select>
        )}
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

export default User