import DynamicTable from "../../../Component/DynamicTable";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavAndSearch from "../../../Component/NavAndSearch";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";
import { useTranslation } from "react-i18next";

const Complaints = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [data, setData] = useState([]);
  const [supdata, setSupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [thisid, setThisId] = useState("");
  const [View, setView] = useState(false);
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
      source.cancel(t("RequestTimeout"));
      setLoading(false);
      toast.error(t("RequestTimeout"));
    }, 10000);

    axios
      .get("https://app.15may.club/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        setData(
          response.data.data.complaints.map((item) => ({
            id: item.id,
            username: item.username,
            categoryName: item.categoryName,
            description: item.description,
            seen: item.seen,
            date: item.date,
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeout);
        if (!axios.isCancel(error)) toast.error(t("ErrorFetchingData"));
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, [update]);

  const handleDelete = (userId, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: t("DeleteConfirmation", { name: userName }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/complaints/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire(t("Deleted"), t("DeleteSuccess", { name: userName }), "success");
          })
          .catch(() => {
            Swal.fire(t("Error"), t("DeleteError", { name: userName }), "error");
          });
      } else {
        Swal.fire(t("Cancelled"), t("DeleteCancelled", { name: userName }), "info");
      }
    });
  };

  const columns = [
    { key: "categoryName", label: t("CategoryName") },
    { key: "username", label: t("Username") },
    { key: "description", label: t("Description") },
  ];

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const statusText = item.seen ? t("Seen") : t("UnSeen");
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(statusText);
    const matchesSearch =
      selectedFilter === ""
        ? Object.entries(item).some(([key, value]) => {
            if (key === "seen") {
              const text = value ? t("Seen") : t("UnSeen");
              return text.toLowerCase().includes(query);
            }
            if (typeof value === "object" && value !== null) {
              return Object.values(value).some((sub) =>
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

  const handleView = (id) => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://app.15may.club/api/admin/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setThisId(id);
        setSupData(response.data.data.complaint);
        setView(true);
      })
      .catch(() => {
        setView(false);
        setThisId("");
        toast.error(t("NoDataAvailable"));
      });
  };

  const onSeen = () => {
    const token = localStorage.getItem("token");
    axios
      .put(`https://app.15may.club/api/admin/complaints/${thisid}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUpdate(!update);
        setThisId("");
        toast.success(t("Seen"));
        setView(false);
      })
      .catch(() => {
        setUpdate(!update);
        setThisId("");
        toast.error(t("ErrorSeen"));
        setView(false);
      });
  };

  const onClose = () => {
    setView(false);
    setThisId("");
  };

  if (loading) return <Loader />;

  return (
    <div>
      <ToastContainer />
      <NavAndSearch
        like={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex px-1 mt-5 justify-end">
        <div className="flex gap-4 justify-end flex-wrap mt-4 mb-2 px-4">
          {[
            { label: t("Seen"), value: t("Seen"), color: "text-one" },
            { label: t("UnSeen"), value: t("UnSeen"), color: "text-one/50" },
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
      </div>

      <DynamicTable
        data={paginatedData}
        columns={columns}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        actions={(row) => (
          <div className={`flex gap-1 ${isRTL ? "justify-end" : "justify-start"}`}>
            <RiDeleteBin6Line
              className="w-[24px] h-[24px] ml-2 text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.id, row.username)}
            />
          </div>
        )}
        Seen={(row) => (
          <div className={`flex gap-1 ${isRTL ? "justify-end" : "justify-start"}`}>
            <span>{row.seen ? t("Seen") : t("UnSeen")}</span>
          </div>
        )}
        view={(row) => (
          <div className={`flex gap-1 ${isRTL ? "justify-end" : "justify-start"}`}>
            <button
              className="rounded-4xl text-white px-2 py-1 bg-one cursor-pointer hover:bg-one/90"
              onClick={() => handleView(row.id)}
            >
              {t("View")}
            </button>
          </div>
        )}
      />

      <div className="flex justify-center mt-4">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#876340",
              borderColor: "#876340",
            },
            "& .Mui-selected": {
              backgroundColor: "#876340",
              color: "white",
              "&:hover": {
                backgroundColor: "#5d4037",
              },
            },
          }}
        />

        {View && (
          <div className="fixed inset-0 bg-white opacity-90 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-xl text-one font-bold mb-4">{t("Description")}</h2>
              <p className="text-black mb-6">{supdata.description}</p>
              <p className="text-black mb-6">{supdata.username}</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={onSeen}
                  className="bg-one hover:bg-one/90 text-white px-4 py-2 rounded"
                >
                  {t("Seen")}
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
