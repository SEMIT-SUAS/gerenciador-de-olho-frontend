import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<OcorrenciasPage />} />
      </Routes>
    </BrowserRouter>
  )
}
