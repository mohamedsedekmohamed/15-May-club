import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const MultiSelectField = ({ value, onChange, placeholder, options }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const optionsarray =
    options?.map((page) => ({
      value: page.id,
      label: page.name || page.item,
    })) || [];

  return (
    <StyledWrapper $isArabic={isArabic}>
      <div className="form-control" dir={isArabic ? 'rtl' : 'ltr'}>
        <Select
          isMulti
          options={optionsarray}
          value={value}
          onChange={onChange}
          placeholder=""
          classNamePrefix="custom-select"
        />
        <label>
          <span>{placeholder}</span>
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
    color: #3c57a6;
    min-height: 60px;
    direction: ${(props) => (props.$isArabic ? 'rtl' : 'ltr')};
    text-align: ${(props) => (props.$isArabic ? 'right' : 'left')};
  }

  .custom-select__control--is-focused {
    border-color: #3c57a6;
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
    left: ${(props) => (props.$isArabic ? 'unset' : '10px')};
    right: ${(props) => (props.$isArabic ? '10px' : 'unset')};
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    color: #bcc1c9;
    transition: 0.3s ease;
    letter-spacing: 0;
  }

  .custom-select__control--is-focused + label span,
  .form-control:has(.custom-select__multi-value) label span {
    color: #3c57a6;
    transform: translateY(-50px) translateX(5px);
  }
`;

export default MultiSelectField;
