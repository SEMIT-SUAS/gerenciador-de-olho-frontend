import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { OcorrenciasProvider } from './context/ocorrenciasContext';
import { VincularAcaoProvider } from './context/vincularDenunciaContext';

export function App() {
  return (
    <BrowserRouter>
      <OcorrenciasProvider>
        <VincularAcaoProvider>
          <Routes>
            <Route index element={<OcorrenciasPage />} />
          </Routes>
        </VincularAcaoProvider>
      </OcorrenciasProvider>
    </BrowserRouter>
  )
}
