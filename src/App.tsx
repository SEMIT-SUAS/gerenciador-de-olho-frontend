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
import { DenunciaDetails } from './pages/OcorrenciasPage/components/SidePanel/Denuncia/DenunciaDetails';
import { PersonasPage } from './pages/PersonasPage';
import { UsuariosPage } from './pages/UsuarioPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FiltersProvider } from './context/FiltersContext';
import { MapActionsProvider } from './context/MapActions';
import { AcaoDetails } from './pages/OcorrenciasPage/components/SidePanel/Acao/AcaoDetails';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />

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
              <Route path=":id" element={<DenunciaDetails />} />
            </Route>

            <Route path="acoes">
              <Route path=":id" element={<AcaoDetails />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <ToastContainer />
      <Toaster position="top-center" duration={3000} />
    </BrowserRouter>
  );
}
