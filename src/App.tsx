import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DashboardPage } from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { DenunciasList } from './components/SidePanel/Denuncia/DenunciasList';
import { DenunciaDetails } from './components/SidePanel/Denuncia/DenunciaDetails';
import { AddDenuncia } from './components/SidePanel/Denuncia/AddDenuncia';
import { IndeferirDenuncia } from './components/SidePanel/Denuncia/IndeferirDenuncia';
import { VincularDenunciaAAcao } from './components/SidePanel/Denuncia/VincularDenunciaAAcao';
import { AcoesList } from './components/SidePanel/Acao/AcoesList';
import { AcaoDetails } from './components/SidePanel/Acao/AcaoDetails';
import { AddAcao } from './components/SidePanel/Acao/AddAcao';
import { VincularAcaoADenuncias } from './components/SidePanel/Acao/VincularAcaoADenuncias';
import { ServicoDetalhes } from './components/Servicos/ServicoDetalhes';
import ServicoEditarPage from './components/Servicos/ServicoEditar';
import { ListaCategorias } from './pages/categoriasServicos/Categorialist';
import ServicoNovo from './components/Servicos/ServicoNovo';
import { ServicesPage } from './pages/ServicesPage';
import { NotFoundPage } from './pages/404';
import { IndeferirAcao } from './components/SidePanel/Acao/IndefirirAcao';
import { ConcluirAcao } from './components/SidePanel/Acao/ConcluirAcao';
import { BannersPage } from './pages/BannersPage';
import { Toaster } from 'sonner';
import { PortaisPage } from './pages/PortaisPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/ocorrencias"
          element={
            <OcorrenciasProvider>
              <OcorrenciasPage />
            </OcorrenciasProvider>
          }
        >
          <Route index element={<Navigate to="denuncias" replace />} />
          <Route path="denuncias">
            <Route index element={<DenunciasList />} />
            <Route path=":denunciaId" element={<DenunciaDetails />} />
            <Route path="add" element={<AddDenuncia />} />
            <Route
              path=":denunciaId/indeferir"
              element={<IndeferirDenuncia />}
            />
            <Route
              path=":denunciaId/vincular-acao"
              element={<VincularDenunciaAAcao />}
            />
          </Route>

          <Route path="acoes">
            <Route index element={<AcoesList />} />
            <Route path=":acaoId" element={<AcaoDetails />} />
            <Route path="add" element={<AddAcao />} />
            <Route path=":acaoId/indeferir" element={<IndeferirAcao />} />
            <Route
              path=":acaoId/vincular-denuncias"
              element={<VincularAcaoADenuncias />}
            />
            <Route path=":acaoId/concluir" element={<ConcluirAcao />} />
          </Route>
        </Route>

        <Route path="/servicos">
          <Route index element={<ServicesPage />} />
          <Route path="categorias" element={<ListaCategorias />} />
          <Route path="novo" element={<ServicoNovo />} />
          <Route path=":id" element={<ServicoDetalhes />} />
          <Route path="editar/:id" element={<ServicoEditarPage />} />
        </Route>
        <Route path="/portais" element={<PortaisPage />} />
        <Route path="/banners" element={<BannersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Notification systems */}
      <ToastContainer />
      <Toaster position="top-center" duration={3000} />
    </BrowserRouter>
  );
}