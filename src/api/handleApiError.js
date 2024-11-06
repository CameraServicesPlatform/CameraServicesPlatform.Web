// apiErrorHandler.js
export const handleApiError = (error) => {
  let errorMessage = "An unexpected error occurred.";

  if (error.response) {
    // Server responded with a status other than 200 range
    errorMessage = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = "No response received from the server.";
  } else {
    // Something else happened while setting up the request
    errorMessage = error.message;
  }

  console.error("API Error:", errorMessage);
  return errorMessage;
};
