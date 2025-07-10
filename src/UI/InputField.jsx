import React from 'react';
import styled from 'styled-components';

const InputField = ({ placeholder, value, onChange, name, email, disabled }) => {
  const inputType = email || 'text';
  const maxLength =
    email === 'number' ? 20 :
    email === 'email' ? 50 :
    100;

  return (
    <StyledWrapper>
      <div className="form-control">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder=""
          required
          disabled={disabled}
          maxLength={maxLength}
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
    width:300px;
  
  }

  .form-control input {
    background-color: transparent;
    border: 2px solid #BCC1C9;
    border-radius: 16px;
    display: block;
    
    width: 100%;
    padding: 15px 0 15px 10px; 
    font-size: 18px;
    color: #876340;
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
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
     padding-left:3px;
    color: #BCC1C9;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus + label span,
  .form-control input:valid + label span {
    color: #876340;
    left: 2px;
   transform: translateY(-40px) translateX(5px); 
`;




export default InputField;
