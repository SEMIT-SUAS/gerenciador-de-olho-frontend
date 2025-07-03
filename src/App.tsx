import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { OcorrenciasProvider } from './context/ocorrenciasContext';
import { VincularDenunciaProvider } from './context/vincularDenunciaContext';

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
    </BrowserRouter>
  )
}
