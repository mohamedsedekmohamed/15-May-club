import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DynamicTable = ({
  data = [],
  columns = [],
  actions,
  actionsstates,
  rowsPerPage,
  currentPage,
  customRender,
  actionsviewselect,
  Seen,
  view,
  buttonstatus
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [popupText, setPopupText] = useState(null);
  const [popupImage, setPopupImage] = useState(null);

  if (!data.length) {
    return (
      <div className="mt-6 text-center text-gray-500">
        {t("no_data_available")}
      </div>
    );
  }

  const keys = columns.map((col) => col.key);

  const truncate = (text, max = 15) => {
    if (!text) return "N/A";
    return text.toString().length > max
      ? text.toString().slice(0, max) + "..."
      : text;
  };

  const handleCellClick = (value) => {
    if (!value) return;

    const lower = value.toString().toLowerCase();

    if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".webp")
    ) {
      setPopupImage(value);
      return;
    }

    if (value.length > 15) {
      setPopupText(value);
    }
  };

  return (
    <>
      <div className="mt-4 overflow-x-auto w-full" dir={isRTL ? "rtl" : "ltr"}>
        <table className="w-full min-w-[800px] border border-one text-left">
          <thead className="bg-three">
            <tr>
              <th className="py-3 text-one px-4">{isRTL ? "رقم" : "S/N"}</th>
              {columns.map((col) => (
                <th key={col.key} className="py-3 text-one px-4">
                  {col.label}
                </th>
              ))}
              {Seen && <th className="py-3 text-one px-4">{t("seen")}</th>}
              {view && <th className="py-3 text-one px-4">{t("view")}</th>}
              {buttonstatus && (
                <th className="py-3 text-one px-4">{t("button_status")}</th>
              )}
              {actions && <th className="py-3 text-one px-4">{t("actions")}</th>}
              {actionsstates && (
                <th className="py-3 text-one px-4">{t("actions_states")}</th>
              )}
              {actionsviewselect && (
                <th className="py-3 text-one px-4">{t("actions_view_select")}</th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium">
                  {(currentPage - 1) * rowsPerPage + i + 1}
                </td>

                {keys.map((key) => {
                  const cellText = row[key]?.toString() || "N/A";
                  return (
                    <td
                      key={key}
                      className="py-3 px-4 cursor-pointer"
                      onClick={() => handleCellClick(cellText)}
                    >
                      {customRender && customRender(key, row[key])
                        ? customRender(key, row[key])
                        : truncate(cellText)}
                    </td>
                  );
                })}

                {Seen && <td className="py-3 px-4">{Seen(row)}</td>}
                {view && <td className="py-3 px-4">{view(row)}</td>}
                {buttonstatus && (
                  <td className="py-3 px-4">{buttonstatus(row)}</td>
                )}
                {actions && <td className="py-3 px-4">{actions(row)}</td>}
                {actionsstates && (
                  <td className="py-3 px-4">{actionsstates(row)}</td>
                )}
                {actionsviewselect && (
                  <td className="py-3 px-4">{actionsviewselect(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-lg text-center">
            <h2 className="text-lg font-semibold mb-4">{t("fulltext")}</h2>
            <p className="text-gray-800 mb-6 break-words">{popupText}</p>

            <button
              onClick={() => setPopupText(null)}
              className="px-6 py-2 bg-one text-white rounded-lg"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      )}

      {popupImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-white p-3 rounded-xl shadow-lg max-w-[90%] max-h-[90%]">
            <img
              src={popupImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />

            <button
              onClick={() => setPopupImage(null)}
              className="absolute top-2 right-2 bg-black text-white rounded-full px-3 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicTable;
