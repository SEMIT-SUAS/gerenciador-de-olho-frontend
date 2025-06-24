
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DenunciasPage } from './pages/DenunciasPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<DenunciasPage />} />
      </Routes>
    </BrowserRouter>
  )
}
