import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { ToastContainer } from 'react-toastify';
import { FiltersProvider } from './context/FiltersContext';

export function App() {
  return (
    <BrowserRouter>
      <OcorrenciasProvider>
        <FiltersProvider>
          <Routes>
            <Route index element={<OcorrenciasPage />} />
          </Routes>
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
