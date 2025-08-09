import React, { useEffect, useState } from "react";
import DynamicTable from '../../../Component/DynamicTable';
import Pagination from "@mui/material/Pagination";
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

const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
      toast.error(t("RequestTimeout"));
    }, 10000);

    axios
      .get("https://app.15may.club/api/admin/posts/categories", {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        setData(response.data.data.categories);
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
    navigate("/admin/addcategories", { state: { sendData: id } });
  };

  const handleDelete = (Id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
    title: t("ConfirmDeleteTitle", { name: userName }) ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/posts/categories/${Id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire(t("Deleted"), t("DeletedSuccess", { name: userName }), "success");
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

    return matchesSearch;
  });

  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return (
      <div className="mt-40">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <NavAndSearch
        nav="/admin/addcategories"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        title={t("Categories")}
        addButtonText={t("Add")}
      />

      <DynamicTable
        data={paginatedData}
        columns={columns}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        actions={(row) => (
          <div className={`flex gap-1 ${isRTL ? "justify-end" : "justify-start"}`}>
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
              '&:hover': { backgroundColor: '#5d4037' },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Categories;
