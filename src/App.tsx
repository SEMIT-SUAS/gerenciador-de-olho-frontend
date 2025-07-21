import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { ToastContainer } from 'react-toastify';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { DenunciasList } from './components/SidePanel/Denuncia/DenunciasList';
import { DenunciaDetails } from './components/SidePanel/Denuncia/DenunciaDetails';
import { VincularDenunciaAAcao } from './components/SidePanel/Denuncia/VincularDenunciaAAcao';
import { IndeferirDenuncia } from './components/SidePanel/Denuncia/IndeferirDenuncia';
import { AcoesList } from './components/SidePanel/Acao/AcoesList';
import { AcaoDetails } from './components/SidePanel/Acao/AcaoDetails';
import { NotFoundPage } from './pages/NotFoundPage';

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
            <Route
              path=":denunciaId/vincular-acao"
              element={<VincularDenunciaAAcao />}
            />
            <Route
              path=":denunciaId/indeferir"
              element={<IndeferirDenuncia />}
            />
          </Route>

          <Route path="acoes">
            <Route index element={<AcoesList />} />
            <Route path=":acaoId" element={<AcaoDetails />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={'/ocorrencias/denuncias'} />} />

        <Route path='*' element={<NotFoundPage/>}/>
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
