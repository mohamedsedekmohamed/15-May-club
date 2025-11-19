import React, { useEffect, useState } from "react";
import DynamicTable from '../../../Component/DynamicTable';
import Pagination from "@mui/material/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavAndSearch from '../../../Component/NavAndSearch';
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";
import { useTranslation } from "react-i18next";

const Numbers = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    axios
      .get("https://app.15may.club/api/admin/members", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data.data.members || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error(t("Error fetching data"));
        setLoading(false);
      });
  }, [update,location.state?.refresh]);

  const handleEdit = (id) => {
    navigate("/admin/addmembers", { state: { sendData: id } });
  };

  const handleDelete = (id, name) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `${t("Areyousureyouwanttodelete")} ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/members/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire(
              t("Deleted!"),
              `${name} ${t("hasbeendeletedsuccessfully")}`,
              "success"
            );
          })
          .catch(() => {
            Swal.fire(
              t("Error!"),
              `${t("Therewasanerrorwhiledeleting")} ${name}`,
              "error"
            );
          });
      }
    });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    return Object.values(item || {}).some((value) =>
      typeof value === "object" && value !== null
        ? Object.values(value || {}).some((sub) =>
            sub?.toString().toLowerCase().includes(query)
          )
        : value?.toString().toLowerCase().includes(query)
    );
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) return <Loader />;

  const columns = [
    { key: "name", label: t("Name") },
    { key: "photo", label: t("Photo") },
    { key: "layer", label: t("Layer") },
    { key: "description", label: t("Description") },
    { key: "number", label: t("Number") },
  ];

  return (
    <div>
      <ToastContainer />

      <NavAndSearch
        nav="/admin/addmembers"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
        customRender={(key, value) =>
          key === "photo" || key === "photoSymbol" ? (
            <div className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
              <img src={value} alt={key} className="w-16 h-16 object-cover rounded" />
            </div>
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
            "& .MuiPaginationItem-root": { color: "#876340", borderColor: "#876340" },
            "& .Mui-selected": {
              backgroundColor: "#876340",
              color: "white",
              "&:hover": { backgroundColor: "#5d4037" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Numbers;
