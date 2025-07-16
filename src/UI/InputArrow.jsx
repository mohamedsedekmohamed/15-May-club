import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const InputArrow = ({ placeholder, value, onChange, name }) => {
  const [options, setOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const mapDataToOptions = (data) =>
    data.map((item) => ({
      value: item.id,
      label: item.name || item.category_name 
    }));

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`https://app.15may.club/api/admin/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let data = [];

        if (name === 'posts/categories') data = response.data.data.categories;

        setOptions(mapDataToOptions(data));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [name]);

  return (
    <div className="relative w-[280px] group form-control">
      <Select
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={(selected) =>
          onChange({ target: { value: selected?.value, name } })
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=""
        classNamePrefix="custom-select"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: state.isFocused ? '#876340' : '#dcdcdc',
            borderWidth: '2px',
            borderRadius: '16px',
            paddingLeft: '8px',
            height: '60px',
            boxShadow: 'none',
            '&:hover': {
              borderColor: '#876340',
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
            display: 'flex',
            color: '#876340',
            padding: '8px',
          }),
        }}
      />

      {/* Floating Label */}
      <label className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-in-out text-one text-sm font-normal
        group-focus-within:top-1 group-focus-within:text-xs group-focus-within:text-one
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm
        px-1 bg-white
        "
        style={{
          transform:
            isFocused || value ? 'translateY(-26px) scale(0.9)' : 'translateY(-50%)',
          transition: 'transform 0.2s ease, font-size 0.2s ease',
        }}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default InputArrow;
