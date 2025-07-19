import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../UI/Loader";
import Card from "../../../UI/Card";
import { IoMdAddCircle } from "react-icons/io";
import Swal from "sweetalert2";

const Competitions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const source = axios.CancelToken.source();

    const timeout = setTimeout(() => {
      source.cancel("Request timeout after 10 seconds.");
      setLoading(false);
      toast.error("Request timed out. Please try again.");
    }, 10000);

    axios
      .get("https://app.15may.club/api/admin/competitions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        clearTimeout(timeout);
        const formattedData = response.data.data.competitions.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          image: item.mainImagepath,
          start: item.startDate,
          end: item.endDate,
        }));
        setData(formattedData);
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

  const handleView = (id) => {
    navigate("/admin/viewcompeitions", { state: { sendData: id } });
  };
  const handleEdit = (id) => {
    navigate("/admin/addCompetitions", { state: { sendData: id } });
  };
  const handleDelete = (Id,userName) => {
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
            `https://app.15may.club/api/admin/competitions/${Id}`,
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
    });  };

  if (loading) return <Loader />;

  return (
    <div className="px-3 space-y-3">
      <div className="w-full flex justify-end">

  <button onClick={()=>navigate("/admin/addCompetitions")}
  className='bg-one flex gap-3 px-4 py-2 items-center rounded-2xl font-medium transition-transform hover:scale-95'> 
    <span className=" text-[20px] lg:text-2xl text-white">Add</span>
    <IoMdAddCircle className="text-[20px] lg:text-2xl text-white" />
  </button>
        </div>

    <div className="flex flex-wrap gap-4 px-4 py-4">
      {data.map((item) => (
        <Card
          key={item.id}
          image={item.image===null ? "https://via.placeholder.com/300x180": item.image}
          title={item.name}
          description={
            <div className="text-sm text-gray-600 space-y-1 ">
<p>
  {item.description.length > 15
    ? `${item.description.slice(0, 15)}...`
    : item.description}
</p>
              <p><strong>Start:</strong> {item.start}</p>
              <p><strong>End:</strong> {item.end}</p>
            </div>
          }
          onView={() => handleView(item.id)}
          onEdit={() => handleEdit(item.id)}
          onDelete={() => handleDelete(item.id ,item.name)}
        />
      ))}
    </div>
        </div>

  );
};

export default Competitions;
