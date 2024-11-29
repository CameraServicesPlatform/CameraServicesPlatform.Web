import React from "react";
import { Steps } from "antd";
import { CheckOutlined, CloseOutlined, CheckCircleOutlined, SmileOutlined, CarOutlined } from "@ant-design/icons";

const { Step } = Steps;

const StepsComponent = ({ currentStep, steps }) => (
  <Steps current={currentStep}>
    {steps.map((step, index) => (
      <Step key={index} title={step.title} icon={step.icon} />
    ))}
  </Steps>
);

export default StepsComponent;