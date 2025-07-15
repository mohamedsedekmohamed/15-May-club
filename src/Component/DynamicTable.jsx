import React from "react";

const DynamicTable = ({
  data = [],
  columns = [],
  actions,
  actionsstates,
  rowsPerPage ,
  currentPage ,
  customRender,
  actionsviewselect
}) => {
  if (!data.length) {
    return <div className="mt-6 text-center text-gray-500">No data available</div>;
  }

  const keys = columns.map((col) => col.key);

  const truncate = (text, max = 15) => {
    if (!text) return "N/A";
    return text.toString().length > max ? text.toString().slice(0, max) + "..." : text;
  };

  return (
 <div className="mt-4 overflow-x-auto w-full">
  <table className="w-full min-w-[800px] border border-one text-left">
    <thead className="bg-three">
      <tr>
        <th className="py-3 text-one px-4">S/N</th>
        {columns.map((col) => (
          <th key={col.key} className="py-3 text-one px-4">{col.label}</th>
        ))}
        {actions && <th className="py-3 text-one px-4">Actions</th>}
        {actionsstates && <th className="py-3 text-one px-4">Change Status</th>}
        {actionsviewselect && <th className="py-3 text-one px-4">Options</th>}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={row.id || i} className="border-t hover:bg-gray-50 transition">
          <td className="py-3 px-4 font-medium">
            {(currentPage - 1) * rowsPerPage + i + 1}
          </td>
         {keys.map((key) => (
  <td key={key} className="py-3 px-4">
    {customRender && customRender(key, row[key])
      ? customRender(key, row[key])
      : truncate(row[key])}
  </td>
))}
          {actions && (
            <td className="py-3 px-4">
              {actions(row)}
            </td>
          )}
          {actionsstates && (
            <td className="py-3 px-4">
              {actionsstates(row)}
            </td>
          )}
          {actionsviewselect && (
            <td className="py-3 px-4">
              {actionsviewselect(row)}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>


  );
};

export default DynamicTable;
