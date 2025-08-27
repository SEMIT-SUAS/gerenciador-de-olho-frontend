import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DashboardPage } from './pages/DashboardPage';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { ServicoDetalhes } from './pages/ServicosPage/components/ServicoDetalhes';
import LoginPage from './pages/LoginPage';
import ServicoEditarPage from './pages/ServicosPage/components/ServicoEditar';
import ServicoNovo from './pages/ServicosPage/components/ServicoNovo';
import { ServicesPage } from './pages/ServicosPage';
import { NotFoundPage } from './pages/404';
import { BannersPage } from './pages/BannersPage';
import { Toaster } from 'sonner';
import { CategoriasPage } from './pages/CategoriaServicoPage';
import { EspacosPublicosPage } from './pages/EspacosPublicosPage/index';
import { AddEspacoPublicoPage } from './pages/EspacosPublicosPage/components/AddEspacoPublicoModal';
import { EditEspacoPublicoPage } from './pages/EspacosPublicosPage/components/EditEspacoPublicoModal';
import { PortaisPage } from './pages/PortaisPage';
import { DenunciaCategoriasPage } from './pages/CategoriasDenunciaPage';
import { SecretariaPage } from './pages/SecretariasPage';
import { PersonasPage } from './pages/PersonasPage';
import { UsuariosPage } from './pages/UsuarioPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FiltersProvider } from './context/FiltersContext';
import { MapActionsProvider } from './context/MapActions';
import { AcaoDetails } from './pages/OcorrenciasPage/components/SidePanel/Acao/AcaoDetails';
import { VincularDenunciaAAcao } from './pages/OcorrenciasPage/components/SidePanel/Denuncia/VincularDenunciaAAcao';
import { CriarAcao } from './pages/OcorrenciasPage/components/SidePanel/Acao/CriarAcao';
import { VincularAcaoView } from './pages/OcorrenciasPage/components/SidePanel/Acao/VincularAcaoView';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/ocorrencias"
            element={
              <MapActionsProvider>
                <FiltersProvider>
                  <OcorrenciasProvider>
                    <OcorrenciasPage />
                  </OcorrenciasProvider>
                </FiltersProvider>
              </MapActionsProvider>
            }
          >
            <Route path="denuncias">
              <Route
                path=":id/vincular-denuncia"
                element={<VincularDenunciaAAcao />}
              />
            </Route>

            <Route path="acoes">
              <Route path=":id" element={<AcaoDetails />} />
              <Route path="criar" element={<CriarAcao />} />
              <Route path=":id/vincular-acao" element={<VincularAcaoView />} />
            </Route>
          </Route>

          <Route path="/servicos">
            <Route index element={<ServicesPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="secretarias" element={<SecretariaPage />} />
            <Route path="novo" element={<ServicoNovo />} />
            <Route path=":id" element={<ServicoDetalhes />} />
            <Route path="editar/:id" element={<ServicoEditarPage />} />
          </Route>

          <Route path="/portais" element={<PortaisPage />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/espacos-publicos">
            <Route index element={<EspacosPublicosPage />} />
            <Route path="add" element={<AddEspacoPublicoPage />} />
            <Route path="edit/:id" element={<EditEspacoPublicoPage />} />
          </Route>

          <Route
            path="/categorias-denuncia"
            element={<DenunciaCategoriasPage />}
          />

          <Route path="/personas" element={<PersonasPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>

        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>

      <ToastContainer />
      <Toaster position="top-center" duration={3000} />
    </BrowserRouter>
  );
}
