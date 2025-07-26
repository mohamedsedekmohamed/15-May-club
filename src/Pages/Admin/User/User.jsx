import DynamicTable from '../../../Component/DynamicTable';
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavAndSearch from '../../../Component/NavAndSearch';
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";
import { useTranslation } from "react-i18next";

const User = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("approved");

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel(t("request_timeout"));
      setLoading(false);
      toast.error(t("request_timeout_message"));
    }, 10000);

    axios.get("https://app.15may.club/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      cancelToken: source.token,
    })
      .then((response) => {
        clearTimeout(timeout);
        setData(response.data.data.users);
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeout);
        if (!axios.isCancel(error)) toast.error(t("fetch_error"));
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, [update]);

  const handleEdit = (id) => {
    navigate("/admin/addUser", { state: { sendData: id } });
  };

  const handleDelete = (userId, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: t("confirm_delete", { name: userName }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://app.15may.club/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(() => {
            setUpdate(!update);
            Swal.fire(t("deleted"), t("deleted_message", { name: userName }), "success");
          })
          .catch(() => {
            Swal.fire(t("error"), t("delete_failed", { name: userName }), "error");
          });
      }
    });
  };

  const approve = (id, userName) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: t("confirm_approve", { name: userName }),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(
          `https://app.15may.club/api/admin/users/${id}/approve`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire(t("approved"), t("approve_success", { name: userName }), "success");
          })
          .catch(() => {
            Swal.fire(t("error"), t("approve_failed", { name: userName }), "error");
          });
      }
    });
  };

  const reject = (id, userName) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: t("confirm_reject", { name: userName }),
      input: 'textarea',
      inputLabel: t("rejection_reason"),
      inputPlaceholder: t("write_reason"),
      showCancelButton: true,
      confirmButtonText: t("yes_reject"),
      cancelButtonText: t("cancel"),
      icon: 'warning',
      preConfirm: (reason) => {
        if (!reason) Swal.showValidationMessage(t("please_enter_reason"));
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(
          `https://app.15may.club/api/admin/users/${id}/reject`,
          { rejectionReason: result.value },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire(t("rejected"), t("reject_success", { name: userName }), "success");
          })
          .catch(() => {
            Swal.fire(t("error"), t("reject_failed", { name: userName }), "error");
          });
      }
    });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = selectedFilter === ""
      ? Object.values(item || {}).some((value) =>
          typeof value === "object" && value !== null
            ? Object.values(value || {}).some((sub) =>
                sub?.toString().toLowerCase().includes(query))
            : value?.toString().toLowerCase().includes(query)
        )
      : (() => {
          const keys = selectedFilter.split(".");
          let value = item;
          for (let key of keys) value = value?.[key];
          return value?.toString().toLowerCase().includes(query);
        })();

    const matchesTab = item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) return <Loader />;

  return (
    <div>
      <ToastContainer />
      <NavAndSearch nav="/admin/addUser" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex gap-4 justify-start px-4 mt-4 mb-4 border-b">
        {["approved", "pending", "rejected"].map((value) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 text-[12px] md:text-[14px] lg:text-[16px] font-medium border-b-2 transition-all duration-200 w-full ${
              activeTab === value
                ? "border-one text-one"
                : "border-transparent text-gray-500 hover:text-one"
            }`}
          >
            {t(value)}
          </button>
        ))}
      </div>

      <DynamicTable
        data={paginatedData}
        columns={[
          { key: "name", label: t("name") },
          { key: "phoneNumber", label: t("phone") },
          { key: "role", label: t("role") },
          { key: "dateOfBirth", label: t("date_of_birth") },
          { key: "email", label: t("email") },
          { key: "status", label: t("status") },
          { key: "purpose", label: t("purpose") },
        ]}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        actions={(row) => (
          <div className='flex gap-1'>
            <CiEdit className="w-[24px] h-[24px] text-green-600 cursor-pointer" onClick={() => handleEdit(row.id)} />
            <RiDeleteBin6Line className="w-[24px] h-[24px] ml-2 text-red-600 cursor-pointer" onClick={() => handleDelete(row.id, row.name)} />
          </div>
        )}
        actionsstates={(row) => (
          <select
            className="text-sm border px-2 py-1 rounded-4xl bg-one text-white"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "approve") approve(row.id, row.name);
              else if (value === "reject") reject(row.id, row.name);
            }}
            defaultValue="select"
          >
            <option disabled>{t("select")}</option>
            <option value="approve">{t("approve")}</option>
            <option value="reject">{t("reject")}</option>
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
              color: '#876340',
              borderColor: '#876340',
            },
            '& .Mui-selected': {
              backgroundColor: '#876340',
              color: 'white',
              '&:hover': {
                backgroundColor: '#5d4037',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default User;
