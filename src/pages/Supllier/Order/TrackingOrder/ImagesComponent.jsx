import React from "react";

const ImagesComponent = ({ beforeImageUrl, afterImageUrl }) => (
  <div>
    {beforeImageUrl && (
      <div>
        <h3>Ảnh trước khi giao hàng:</h3>
        <img
          src={beforeImageUrl}
          alt="Before Delivery"
          style={{ maxWidth: "100%" }}
        />
      </div>
    )}
    {afterImageUrl && (
      <div>
        <h3>Ảnh sau khi giao hàng:</h3>
        <img
          src={afterImageUrl}
          alt="After Delivery"
          style={{ maxWidth: "100%" }}
        />
      </div>
    )}
  </div>
);

export default ImagesComponent;