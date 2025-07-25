import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
  <StyledWrapper>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </StyledWrapper>
    </div>
  
  );
}

const StyledWrapper = styled.div`
  .spinner {
    position: relative;
    width: 24.6px;
    height: 24.6px;
    animation-name: rotateSpin;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: normal;
    --clr: #876340;
  }

  @keyframes rotateSpin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .spinner div {
    width: 100%;
    height: 100%;
    background-color: var(--clr);
    border-radius: 50%;
    animation: spinnerAni 1s infinite backwards;
  }

  .spinner div:nth-child(1) {
    animation-delay: 0.12s;
    background-color: var(--clr);
    opacity: .9;
  }

  .spinner div:nth-child(2) {
    animation-delay: 0.24s;
    background-color: var(--clr);
    opacity: .8;
  }

  .spinner div:nth-child(3) {
    animation-delay: 0.36s;
    background-color: var(--clr);
    opacity: .7;
  }

  .spinner div:nth-child(4) {
    animation-delay: 0.48s;
    background-color: var(--clr);
    opacity: .6;
  }

  .spinner div:nth-child(5) {
    animation-delay: 0.60s;
    background-color: var(--clr);
    opacity: .5;
  }

  @keyframes spinnerAni {
    0% {
      transform: rotate(0deg) translateY(-200%);
    }

    60%, 100% {
      transform: rotate(360deg) translateY(-200%);
    }
  }`;

export default Loader;
