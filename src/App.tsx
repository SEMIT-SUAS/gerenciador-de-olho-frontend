import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DashboardPage } from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { ServicoDetalhes } from './pages/ServicosPage/components/ServicoDetalhes';
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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/ocorrencias"
            element={
              <OcorrenciasProvider>
                <OcorrenciasPage />
              </OcorrenciasProvider>
            }
          >
            <Route path="denuncias">
              <Route path=":id" element={<DenunciaDetails />} />
            </Route>

            {/* As rotas de "acoes" também ficariam aqui dentro se estivessem ativas */}
            
          </Route> {/* <--- CORREÇÃO: A rota /ocorrencias é fechada AQUI */}

          {/* Agora, /servicos e as outras são rotas irmãs de /ocorrencias */}
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

          {/* O NotFoundPage deve ser irmão dos outros para pegar qualquer rota inválida */}
          <Route path="*" element={<NotFoundPage />} /> 

        </Route> {/* <- Fechamento do ProtectedRoute */}
      </Routes>

      <ToastContainer />
      <Toaster position="top-center" duration={3000} />
    </BrowserRouter>
  );
}