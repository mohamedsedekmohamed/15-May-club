import DynamicTable from "../../../Component/DynamicTable";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import NavAndSearch from "../../../Component/NavAndSearch";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";
import ShowOptions from '../../../Component/ShowOptions.js';
import { useTranslation } from "react-i18next";

const Votes = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState([]);
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
      .get("https://app.15may.club/api/admin/votes", {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        setData(response.data.data.votes);
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
    navigate("/admin/addvotes", { state: { sendData: id } });
  };

  const handleDelete = (userId, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: t("AreYouSureDelete", { name: userName }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/votes/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire(t("Deleted"), t("DeletedSuccessfully", { name: userName }), "success");
          })
          .catch(() => {
            Swal.fire(t("Error"), t("ErrorWhileDeleting", { name: userName }), "error");
          });
      } else {
        Swal.fire(t("Cancelled"), t("NotDeleted", { name: userName }), "info");
      }
    });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch = selectedFilter === ""
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

  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    { key: "name", label: t("Name") },
    { key: "maxSelections", label: t("MaxSelections") },
    { key: "startDate", label: t("StartDate") },
    { key: "endDate", label: t("EndDate") },
    { key: "votesCount", label: t("VotesCount") },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <NavAndSearch
        nav="/admin/addvotes"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DynamicTable
        data={paginatedData}
        columns={columns}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        actions={(row) => (
          <div className={`flex gap-1 ${isRTL?"justify-end":" justify-start"} `}>
            <CiEdit
              className="w-[24px] h-[24px] text-green-600 cursor-pointer"
              onClick={() => handleEdit(row.id)}
              title={t("Edit")}
            />
            <RiDeleteBin6Line
              className="w-[24px] h-[24px] ml-2 text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.id, row.name)}
              title={t("Delete")}
            />
          </div>
        )}
        actionsviewselect={(row) => (
         <button
  onClick={() => ShowOptions(row.id, t, i18n)}
              className="bg-one/90 text-white px-4 py-2 rounded-2xl text-[12px] hover:bg-one"
          >
            {t("ViewOptions" )}
          </button>
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

export default Votes;
