import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const InputField = ({ placeholder, value, onChange, name, email, disabled
  ,min=null
 }) => {
  const { t, i18n } = useTranslation();

  const inputType = email || 'text';
  const maxLength =
    email === 'number' ? 40 :
    email === 'email' ? 100 :
    250;

  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <StyledWrapper dir={direction}>
      <div className="form-control">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          required
          min={min}
          disabled={disabled}
          maxLength={maxLength}
          placeholder=""
        />
        <label>{t(placeholder)}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    width: 280px;
  }

  .form-control input {
    background-color: transparent;
    border: 2px solid #BCC1C9;
    border-radius: 16px;
    display: block;
    width: 100%;
    padding: 15px 10px;
    font-size: 18px;
    color: #3c57a6;
    direction: inherit;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-color: #3c57a6;
    color: black;
  }

  .form-control label {
    position: absolute;
    top: 15px;
    left: 10px;
    right: 10px;
    font-size: 18px;
    color: #BCC1C9;
    pointer-events: none;
    transition: 0.3s ease;
    direction: inherit;
  }

  .form-control input:focus + label,
  .form-control input:valid + label {
    color: #3c57a6;
    transform: translateY(-45px) scale(0.85);
  }
`;

export default InputField;
