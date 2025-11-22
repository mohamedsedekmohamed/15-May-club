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

const Posts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
      .get("https://app.15may.club/api/admin/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        setData(
          response.data.data.posts.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
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
    navigate("/admin/addpost", { state: { sendData: id } });
  };

  const handleDelete = (postId, postTitle) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: t("DeleteConfirmation", { name: postTitle }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.15may.club/api/admin/posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire(t("Deleted"), t("DeleteSuccess", { name: postTitle }), "success");
          })
          .catch(() => {
            Swal.fire(t("Error"), t("DeleteError", { name: postTitle }), "error");
          });
      } else {
        Swal.fire(t("Cancelled"), t("DeleteCancelled", { name: postTitle }), "info");
      }
    });
  };

  const columns = [
    { key: "title", label: t("Title") },
    { key: "category", label: t("Category") },
    { key: "image", label: t("Image") },
  ];

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    return selectedFilter === ""
      ? Object.entries(item || {}).some(([key, value]) =>
          typeof value === "object"
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
  });

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
      <NavAndSearch
        nav="/admin/addpost"
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
              onClick={() => handleDelete(row.id, row.title)}
            />
          </div>
        )}
        customRender={(key, value) => {
          if (key === "image") {
            return (
              <div className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
                <img
                  src={value}
                  alt="Post"
                  className="w-20 h-12 object-cover rounded"
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

export default Posts;
