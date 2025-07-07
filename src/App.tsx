import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { OcorrenciasProvider } from './context/ocorrenciasContext';
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <BrowserRouter>
      <OcorrenciasProvider>
          <Routes>
            <Route index element={<OcorrenciasPage />} />
          </Routes>
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
