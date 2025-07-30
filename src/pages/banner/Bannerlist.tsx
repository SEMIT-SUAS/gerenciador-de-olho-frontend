import { useEffect, useState } from "react";
import type { Banner } from "../../types/Banners";
import { getAllBanners, uploadBanner } from "../../services/bannersService";
import { toast } from "react-toastify";
import { ModalCadastroBanner } from "./ModalCadastroBanner";

export function BannerList() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [visivel, setVisivel] = useState(true);
  const [ativo, setAtivo] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    try {
      const allBanners = await getAllBanners();
      setBanners(allBanners);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar os banners.");
    } finally {
      setLoading(false);
    }
  }
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagem) {
        alert("Selecione uma imagem.");
        return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("imagem", imagem);
    formData.append("link", link);
    formData.append("visivel", visivel.toString());
    formData.append("ativo", ativo.toString());

    try {
        const result = await uploadBanner(formData);
        toast.success("Banner cadastrado com sucesso!");
        console.log(result);
        setModalAberto(false);
    } catch (error: any) {
        toast.error(`Erro ao cadastrar banner: ${error.message}`);
    }
    };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Banners</h2>

      <button onClick={() => setModalAberto(true)}>+ Cadastrar Novo Banner</button>

      {mensagem && <p>{mensagem}</p>}

      {modalAberto && (
        <ModalCadastroBanner
            nome={nome}
            setNome={setNome}
            imagem={imagem}
            setImagem={setImagem}
            link={link}
            setLink={setLink}
            visivel={visivel}
            setVisivel={setVisivel}
            ativo={ativo}
            setAtivo={setAtivo}
            onSubmit={handleSubmit}
            onClose={() => setModalAberto(false)}
            overlayStyle={modalOverlayStyle}
            contentStyle={modalContentStyle}
        />
        )}

      <hr style={{ margin: "2rem 0" }} />

      <h3>Lista de Banners</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro: {error}</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                width: "250px",
                textAlign: "center",
              }}
            >
              <img
                src={banner.imagem}
                alt={banner.nome}
                style={{ maxWidth: "100%", height: "150px", objectFit: "cover" }}
              />
              <h4>{banner.nome}</h4>
              {banner.link && (
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  Acessar Link
                </a>
              )}
              <p>
                Visível: {banner.visivel ? "Sim" : "Não"} <br />
                Ativo: {banner.ativo ? "Sim" : "Não"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Estilo do modal
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "10px",
  maxWidth: "500px",
  width: "100%",
  boxShadow: "0 0 10px rgba(0,0,0,0.25)",
};
