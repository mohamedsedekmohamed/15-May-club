import DynamicTable from "../../../Component/DynamicTable";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavAndSearch from "../../../Component/NavAndSearch";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../UI/Loader";
import { useTranslation } from "react-i18next";
import { IoMdAddCircle } from "react-icons/io";

const Banner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel("Request timeout after 10 seconds.");
      setLoading(false);
      toast.error(t("RequestTimeout"));
    }, 10000);

    axios
      .get("https://app.15may.club/api/admin/banners", {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        const banners = response.data?.data?.banners || [];
        setData(
          banners.map((item) => ({
            id: item.id,
            image: item.imagePath,
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

  const handleEdit = (id) => {
    navigate("/admin/addbanner", { state: { sendData: id } });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: t("DeleteConfirmationSimple"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/banners/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire(t("Deleted"), t("DeleteSuccessSimple"), "success");
          })
          .catch(() => {
            Swal.fire(t("Error"), t("DeleteErrorSimple"), "error");
          });
      }
    });
  };

  const columns = [{ key: "image", label: t("Image") }];

  const filteredData = data.filter((item) =>
    item.image?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
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
   
<button
            onClick={() => navigate("/admin/addbanner")}
            className='bg-one flex gap-3 px-4 py-2 items-center rounded-2xl font-medium transition-transform hover:scale-95'
          >
            <span className="text-[20px] lg:text-2xl text-white">{t("Add")}</span>
            <IoMdAddCircle className="text-[20px] lg:text-2xl text-white" />
          </button>
      <DynamicTable
        data={paginatedData}
        columns={columns}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        actions={(row) => (
          <div className={`flex gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
            <CiEdit
              className="w-[24px] h-[24px] text-green-600 cursor-pointer"
              onClick={() => handleEdit(row.id)}
            />
            <RiDeleteBin6Line
              className="w-[24px] h-[24px] text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.id)}
            />
          </div>
        )}
        customRender={(key, value) => {
          if (key === "image") {
            return (
              <div className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
                <img
                  src={value}
                  alt="Banner"
                  className="w-32 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                />
              </div>
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
              color: "#3c57a6",
              borderColor: "#3c57a6",
            },
            "& .Mui-selected": {
              backgroundColor: "#3c57a6",
              color: "white",
              "&:hover": { backgroundColor: "#5d4037" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Banner;
