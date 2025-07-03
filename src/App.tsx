import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { OcorrenciasProvider } from './context/ocorrenciasContext';
import { VincularDenunciaProvider } from './context/vincularDenunciaContext';
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <BrowserRouter>
      <OcorrenciasProvider>
        <VincularDenunciaProvider>
          <Routes>
            <Route index element={<OcorrenciasPage />} />
          </Routes>
        </VincularDenunciaProvider>
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
  )
}
