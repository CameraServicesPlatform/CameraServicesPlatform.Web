import React, { useState } from "react";
import { addImgProductBefore, addImgProductAfter } from "../../api/orderApi";
import { message } from "antd";

const ImageUploadPopup = ({ orderId, type, onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a file first.");
      return;
    }

    try {
      const response =
        type === "before"
          ? await addImgProductBefore(orderId, file)
          : await addImgProductAfter(orderId, file);

      if (response.isSuccess) {
        message.success("Image uploaded successfully.");
        onClose();
      } else {
        message.error(response.messages.join(", "));
      }
    } catch (error) {
      message.error("An error occurred while uploading the image.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Upload Image {type === "before" ? "Before" : "After"} Order
        </h2>
        <input type="file" onChange={handleFileChange} />
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-500 text-white rounded-md py-2 px-4 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white rounded-md py-2 px-4"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPopup;
