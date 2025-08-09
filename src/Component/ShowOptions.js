import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import Chart from "chart.js/auto";

const MySwal = withReactContent(Swal);

const ShowOptions = async (id, t, i18n) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `https://app.15may.club/api/admin/votes/${id}/result`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { success, data } = response.data;

    if (!success || !data?.results?.length) {
      return MySwal.fire({
        title: t("NoData"),
        text: t("NoVoteFound"),
        confirmButtonText: t("Close"),
      });
    }

    const results = data.results;
    const labels = results.map((item) => item.item);
    const values = results.map((item) => item.percentage);
// const values = results.map((item) => item.votesCount);
    // ✅ شرط: لو كل النسب = 0
    const allZero = values.every((val) => val === 0);
    if (allZero) {
      return MySwal.fire({
        title: t("NoData"),
        text: t("NoVotesYet"), // أضف هذا المفتاح للترجمة
        confirmButtonText: t("Close"),
      });
    }

    const canvas = document.createElement("canvas");
    canvas.id = "voteChart";

    await MySwal.fire({
      title: t("AvailableOptions"),
      html: canvas,
      didOpen: () => {
        const ctx = document.getElementById("voteChart").getContext("2d");

        new Chart(ctx, {
          type: "pie",
          data: {
            labels,
            datasets: [
              {
                label: t("VotePercentage"),
                data: values,
                backgroundColor: [
                  "#36A2EB",
                  "#FF6384",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                // position: i18n.language === "ar" ? "left" : "right",
              },
            },
          },
        });
      },
      showConfirmButton: true,
      confirmButtonText: t("Close"),
      customClass: {
        popup: "rtl text-right font-sans",
        confirmButton:
          "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
      },
    });
  } catch {
    MySwal.mixin({
      toast: true,
      // position: i18n.language === "ar" ? "top-left" : "top-right",
      icon: "error",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "font-sans text-sm",
      },
    }).fire({
      title: t("FailedToFetchResults"),
    });
  }
};

export default ShowOptions;
