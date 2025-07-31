// Navigator.tsx
import { Routes, Route } from "react-router-dom";
import { OcorrenciasPage } from "../pages/OcorrenciasPage";
import { ListaCategorias } from "../pages/categoriasServicos/Categorialist";
import { PortaisList } from "../pages/portais/PortaisList";
import { BannerList } from "../pages/banner/Bannerlist";
import { ServicesList } from "../pages/services/ServicesList";
import { ServicoDetalhes } from "../pages/services/ServicoDetalhes";
import { ServicoNovo } from "../pages/services/ServicoNovo";
import { ServicoEditar } from "../pages/services/ServicoEditar";

export function Navigator() {
  return (
    <Routes>
      <Route index element={<OcorrenciasPage />} />
      <Route path="/categorias" element={<ListaCategorias />} />
      <Route path="/portais" element={<PortaisList />} />
      <Route path="/banner" element={<BannerList />} />
      <Route path="/servicos" element={<ServicesList />} />
      <Route path="/servico/novo" element={<ServicoNovo />} />
      <Route path="/servico/:id" element={<ServicoDetalhes />} />
      <Route path="/servico/editar/:id" element={<ServicoEditar />} />
    </Routes>
  );
}
