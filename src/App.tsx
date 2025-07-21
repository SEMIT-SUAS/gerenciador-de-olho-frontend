import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OcorrenciasPage } from './pages/OcorrenciasPage';
import { OcorrenciasProvider } from './context/OcorrenciasContext';
import { ToastContainer } from 'react-toastify';
import { FiltersProvider } from './context/FiltersContext';
import {ServicesList} from './pages/services/ServicesList';
import { ServicoDetalhes } from './pages/services/ServicoDetalhes';
import {ServicoNovo} from './pages/services/ServicoNovo';
import {ServicoEditar} from './pages/services/ServicoEditar';
import { ListaCategorias } from './pages/categoriasServicos/Categorialist';

export function App() {
  return (
    <BrowserRouter>
      <OcorrenciasProvider>
        <FiltersProvider>
          <Routes>
            <Route index element={<OcorrenciasPage />} />
            <Route path='/categorias' element={<ListaCategorias/>}/>
            <Route path='/servicos' element={<ServicesList/>}/>
            <Route path="/servico/novo" element={<ServicoNovo />} />
            <Route path="/servico/:id" element={<ServicoDetalhes />} />
            <Route path="/servico/editar/:id" element={<ServicoEditar />} />
          </Routes>
        </FiltersProvider>
      </OcorrenciasProvider>

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
