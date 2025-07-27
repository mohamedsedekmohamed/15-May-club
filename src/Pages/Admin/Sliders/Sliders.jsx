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
import { useTranslation } from "react-i18next";


const Sliders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"
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
      toast.error(t("RequestTimeout"));
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
        if (!axios.isCancel(error)) {
          toast.error(t("ErrorFetchingData"));
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
      title: t("DeleteConfirmation", { name: userName }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/sliders/${userId}`, {
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
    { key: "name", label: t("Name") },
    { key: "order", label: t("Order") },
    { key: "image", label: t("Image") },
  ];

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const statusText = item.status === false || item.status === 0 ? "disabled" : "active";
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(statusText);
    const matchesSearch =
      selectedFilter === ""
        ? Object.entries(item || {}).some(([key, value]) => {
            if (key === "status") {
              const text = value === false || value === 0 ? "disabled" : "active";
              return t(text).toLowerCase().includes(query);
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

  const handleToggleStatus = (row) => {
    const newStatus = row.status ? "disabled" : "active";
    const token = localStorage.getItem("token");
    axios
      .patch(
        `https://app.15may.club/api/admin/sliders/${row.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(t("StatusUpdated"));
        setUpdate((prev) => !prev);
      })
      .catch(() => {
        toast.error(t("StatusUpdateFailed"));
      });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <ToastContainer />
      <NavAndSearch
        nav="/admin/addSliders"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex gap-4 justify-end flex-wrap mt-4 mb-2 px-4">
        {[
          { label: t("Active"), value: "active", color: "text-one" },
          { label: t("Disabled"), value: "disabled", color: "text-one/50" },
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
          <div className={`flex gap-1 ${isRTL?"justify-end":" justify-start"} `}>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={row.status}
                onChange={() => handleToggleStatus(row)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer relative after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded-full after:left-0.5 after:top-0.5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
</div>        )}
        actions={(row) => (
          <div className={`flex gap-1 ${isRTL?"justify-end":" justify-start"} `}>
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
                     <div className={`flex gap-1 ${isRTL?"justify-end":" justify-start"} `}>

              <img
                src={value}
                alt="Slider"
                className="w-20 h-12 object-cover rounded"
              />
              </div>
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
                {value === 0 ? t("Active") : t("Disabled")}
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
      </div>
    </div>
  );
};

export default Sliders;
