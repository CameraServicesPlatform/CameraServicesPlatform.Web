import "aos/dist/aos.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { StateProvider } from "./context/StateProvider";
import { persistor, store } from "./redux/store";
import Routers from "./routers/Routers";

import AOS from "aos";
import { registerables } from "chart.js";
import Chart from "chart.js/auto";
import { AuthProvider } from "./context/AuthContext";
AOS.init({
  duration: 1000,
});
Chart.register(...registerables);

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StateProvider>
            <BrowserRouter>
              <AuthProvider>
                <Routers />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                {/* Same as */}
                <ToastContainer />
              </AuthProvider>
            </BrowserRouter>
          </StateProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
