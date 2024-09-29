import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import { toast } from "react-toastify";

const CheckInPage = () => {
  const [result, setResult] = useState("No result");

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
      toast.success(data.text);
    }
  };

  const handleError = (err) => {
    toast.error(err);
  };

  return (
    <div className="container grid grid-cols-2 gap-4 ">
      <div className="mt-10 w-full ">
        <h1 className="text-primary font-bold uppercase text-center text-md my-2">
          Check in tự động cùng Camera Service Platform
        </h1>
        <div className=" p-4 rounded-md shadow-xl">
          <QrReader delay={300} onError={handleError} onScan={handleScan} />
        </div>
      </div>
      <div className="mt-8 rounded-lg p-4 shadow-lg">
        <div>
          <span>{result}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
