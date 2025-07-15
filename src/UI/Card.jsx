import React from 'react';

const Card = ({ image, title, description, onView,onEdit, onDelete}) => {
  return (
    <div className="w-[300px] rounded-2xl shadow-lg overflow-hidden bg-white flex flex-col items-center">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-[180px] object-cover"
      />

      {/* Content */}
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>

        {/* Dates */}
        <div className="text-xs text-gray-500 mb-2 space-y-1">
         
        </div>
      </div>

      {/* Button */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={onView}
          className="bg-one text-white px-4  text-[12px] md:text-[18px] py-2   rounded-xl hover:bg-one/90 transition"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="bg-one text-white px-4  text-[12px] md:text-[18px] py-2   rounded-xl hover:bg-one/90 transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-one text-white px-4  text-[12px] md:text-[18px] py-2   rounded-xl hover:bg-one/90 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
