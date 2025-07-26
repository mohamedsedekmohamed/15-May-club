import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const InputField = ({ placeholder, value, onChange, name, email, disabled }) => {
  const { t, i18n } = useTranslation();

  const inputType = email || 'text';
  const maxLength =
    email === 'number' ? 20 :
    email === 'email' ? 50 :
    100;

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
    color: #876340;
    direction: inherit;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-color: #876340;
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
    color: #876340;
    transform: translateY(-45px) scale(0.85);
  }
`;

export default InputField;
