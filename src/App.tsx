import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { ToastContainer } from 'react-toastify';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { DenunciasList } from './components/SidePanel/Denuncia/DenunciasList';
import { DenunciaDetails } from './components/SidePanel/Denuncia/DenunciaDetails';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/ocorrencias"
          element={
            <OcorrenciasProvider>
              <OcorrenciasPage />
            </OcorrenciasProvider>
          }
        >
          <Route path="denuncias">
            <Route index element={<DenunciasList />} />
            <Route path=":denunciaId" element={<DenunciaDetails />} />
          </Route>

          <Route path="acoes">
            <Route index element={<h1>Listando as acoes</h1>} />
            <Route path=":acaoId" element={<h1>Detalhes da acao</h1>} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={'/ocorrencias/denuncias'} />} />
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
  );
}
