import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';



const MultiSelectField = ({ value, onChange, placeholder,options }) => {
     const optionsarray = options?.map(page => ({
    value: page.id,
    label: page.name ||page.item,
  })) || [];
  return (
    <StyledWrapper>
      <div className="form-control">
        <Select
          isMulti
          options={optionsarray}
          value={value}
          onChange={onChange}
          placeholder=""
          classNamePrefix="custom-select"
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
    width: 280px;
  }

  .custom-select__control {
    background-color: transparent;
    border: 2px solid #bcc1c9;
    border-radius: 16px;
    padding-left: 5px;
    font-size: 18px;
    color: #876340;
    min-height: 60px;
  }

  .custom-select__control--is-focused {
    border-color: #876340;
    box-shadow: none;
  }

  .custom-select__multi-value {
    background-color: #e8dacd;
    border-radius: 12px;
    padding: 2px 6px;
    font-size: 14px;
  }

  .custom-select__placeholder {
    color: transparent;
  }

  .form-control label {
    position: absolute;
    top: 18px;
    left: 10px;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    padding-left: 3px;
    color: #bcc1c9;
    transition: 0.3s ease;
  }

  /* When select is focused or has value, float label */
  .custom-select__control--is-focused + label span,
  .form-control:has(.custom-select__multi-value) label span {
    color: #876340;
    transform: translateY(-50px) translateX(5px);
  }
`;

export default MultiSelectField;
