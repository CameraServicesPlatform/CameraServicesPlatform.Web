import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 8px solid transparent;
  border-top-color: #2ecc71; /* Màu xanh lá */
  animation: ${spin} 2s linear infinite;
  &:before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 8px solid transparent;
    border-top-color: #ffffff; /* Màu trắng */
    animation: ${spin} 1.5s linear infinite reverse;
  }
`;

const LoadingText = styled.p`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  animation: blink 1s infinite;

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const LoadingComponent = ({ isLoading }) => {
  return isLoading ? (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>
        CameraServicePlatform đang tải dữ liệu bạn chờ xíu nhé...
      </LoadingText>
    </LoadingContainer>
  ) : null;
};

export default LoadingComponent;
