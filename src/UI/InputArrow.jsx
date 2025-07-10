import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styled from 'styled-components';

const InputArrow = ({ placeholder, value, onChange, name }) => {
  const [options, setOptions] = useState([]);

  const mapDataToOptions = (data) =>
    data.map((item) => ({
      value: item.id || item.category_id,
      label: item.name || item.category_name || item.bus_number,
    }));

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`https://bcknd.ticket-hub.net/api/admin2/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let data = [];
        if (name === 'countries') data = response.data.countries;
        else if (name === 'cities') data = response.data.cities;
        else if (name === 'zones') data = response.data.zones;
        else if (name === 'users') data = response.data.users;
        else if (name === 'car_categories') data = response.data;
        else if (name === 'car_brands') data = response.data;
        else if (name === 'operators') data = response.data.operators;
        else if (name === 'busses') data = response.data.buses;
        else if (name === 'currencies') data = response.data.currancies;
        else if (name === 'trainTypes') data = response.data.trainTypes;
        else if (name === 'trainRoutes') data = response.data.routes;
        else if (name === 'trainclasses') data = response.data.trainClasses;
        else if (name === 'agents') data = response.data.agents;
        else if (name === 'point') data = response.data.currencies;
        else if (name === 'currency_point') data = response.data.currencies;
        else if (name === 'admin') data = response.data.roles;

        setOptions(mapDataToOptions(data));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [name]);

  return (
    <StyledWrapper>
      <div className="form-control">
        <Select
          options={options}
          value={options.find((option) => option.value === value)}
          onChange={(selected) => {
            onChange({ target: { value: selected?.value, name } });
          }}
          placeholder=""
          classNamePrefix="custom-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '2px solid #fff',
              borderRadius: 0,
              padding: '4px 0',
              boxShadow: 'none',
              color: '#fff',
            }),
            singleValue: (base) => ({
              ...base,
              color: '#fff',
              fontSize: '18px',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#999',
              fontSize: '18px',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#fff',
              color: '#333',
              zIndex: 9999,
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? '#f0f0f0' : '#fff',
              color: '#333',
            }),
            indicatorSeparator: () => ({ display: 'none' }),
          }}
        />

        <label>
          {placeholder.split('').map((char, index) => (
            <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
              {char}
            </span>
          ))}
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    margin: 20px 0 40px;
    width: 300px;
  }

  .form-control .custom-select__control {
    border: 0;
    border-bottom: 2px solid #876340;
    padding: 12px 0;
    background-color: transparent;
  }

  .form-control label {
    position: absolute;
    top: 15px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
    color: #876340;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control:focus-within label span,
  .form-control .custom-select__single-value ~ label span {
    color: #876340;
    transform: translateY(-30px);
  }
`;

export default InputArrow;
