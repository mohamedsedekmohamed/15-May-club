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
    
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  // const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  // const paginatedData = filteredData.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );
 useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
  const token = localStorage.getItem("token");
  const source = axios.CancelToken.source(); // لإنهاء الطلب لو استغرق وقت طويل

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
      clearTimeout(timeout); // إلغاء العداد إذا تم الرد
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

  return () => clearTimeout(timeout); // تنظيف العداد عند الخروج
}, [update]);

 const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };


  const handleEdit = (id) => {
    navigate("/admin/adduser", { state: { sendData: id } });
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
   if (loading) {
      return (
        <Loader/>
      );}

  return (
    <div>
      <NavAndSearch nav="/admin/addUser" searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <DynamicTable
        data={data}
        columns={columns}
        rowsPerPage={10}
        currentPage={1}
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
          {/* <div className="flex justify-center mt-4">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="secondary"
          shape="rounded"
        />
      </div> */}
    </div>
  )
}

export default User