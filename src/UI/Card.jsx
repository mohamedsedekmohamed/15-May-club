import React from 'react';
import { useTranslation } from 'react-i18next';

const Card = ({ image, title, description, onView, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="w-[300px] rounded-2xl shadow-lg overflow-hidden bg-white flex flex-col items-center">
      {/* الصورة */}
      <img
        src={image}
        alt={title}
        className="w-full h-[180px] object-cover"
      />

      {/* المحتوى */}
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>

        {/* قسم التواريخ لاحقًا إذا لزم */}
        <div className="text-xs text-gray-500 mb-2 space-y-1"></div>
      </div>

      {/* الأزرار */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={onView}
          className="bg-one text-white px-4 text-[12px] md:text-[18px] py-2 rounded-xl hover:bg-one/90 transition"
        >
          {t('view')}
        </button>
        <button
          onClick={onEdit}
          className="bg-one text-white px-4 text-[12px] md:text-[18px] py-2 rounded-xl hover:bg-one/90 transition"
        >
          {t('Edit')}
        </button>
        <button
          onClick={onDelete}
          className="bg-one text-white px-4 text-[12px] md:text-[18px] py-2 rounded-xl hover:bg-one/90 transition"
        >
          {t('Delete')}
        </button>
      </div>
    </div>
  );
};

export default Card;
