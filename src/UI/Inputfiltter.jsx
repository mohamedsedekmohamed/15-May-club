import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";

const Inputfiltter = ({ placeholder, value, like, onChange, name, shara }) => {
  const [arrThing, setArrthing] = useState([]);
  const [control, setControl] = useState(name);
  const { t } = useTranslation();

  useEffect(() => {
    setControl(name);
    const token = localStorage.getItem('token');

    if (name === "role") {
      const typeArray = [
        { value: "guest", label: t("Guest") },
        { value: "member", label: t("Memberr" )}
      ];
      setArrthing(typeArray);
    }
  }, [name, shara]);

 
  return (
    <div className="relative group flex flex-col items-start justify-center text-one ">
      <Select
        name={name}
        value={arrThing.find(option => option.value === value) || null}
        onChange={(selectedOption) =>
          onChange({ target: { name, value: selectedOption?.value || '' } })
        }
        options={arrThing}
     placeholder={placeholder}
          classNamePrefix="custom-select"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: state.isFocused ? '#3c57a6' : '#dcdcdc',
            borderWidth: '2px',
            borderRadius: '16px',
            paddingLeft: '8px',
            height: '60px',
            boxShadow: 'none',
            width:"280px",
            '&:hover': {
              borderColor: '#3c57a6',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: '#333',
            fontSize: '16px',
          }),
          placeholder: (base) => ({
            ...base,
            color: '#aaa',
            fontSize: '16px',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? '#f0f0f0' : '#fff',
            color: '#333',
          }),
          indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    display: 'flex', // ← هنا تم التصحيح
    color: '#3c57a6',
    padding: '8px',
  }),        }}
      />
    </div>
  );
};

export default Inputfiltter;
