import { BrowserRouter } from "react-router-dom";
import { OcorrenciasProvider } from "./context/OcorrenciasContext";
import { FiltersProvider } from "./context/FiltersContext";
import { ToastContainer } from "react-toastify";
import { Navigator } from "./navigator/Navigator";

export function App() {
  return (
    <BrowserRouter>
      <OcorrenciasProvider>
        <FiltersProvider>
          <Navigator />
        </FiltersProvider>
      </OcorrenciasProvider>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        className="z-50"
      />
    </BrowserRouter>
  );
}