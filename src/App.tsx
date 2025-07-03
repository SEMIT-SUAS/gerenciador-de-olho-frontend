import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<OcorrenciasPage />} />
      </Routes>

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
