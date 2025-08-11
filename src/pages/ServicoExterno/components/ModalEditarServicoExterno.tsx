import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {getServicoExternoById,updateServicoExterno,} from "../../../services/servicoExternoService";
import type { ServiceExterno } from "../../../types/ServicoExterno";

interface ModalEditarServicoExternoProps {
  servicoId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.4)",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: "#fff",
  padding: "20px",
  borderRadius: 8,
  width: "100%",
  maxWidth: 600,
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
};

export function ModalEditarServicoExterno({
  servicoId,
  onClose,
  onSuccess,
}: ModalEditarServicoExternoProps) {
  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados: ServiceExterno = await getServicoExternoById(servicoId);
        if (!ativo) return;
        setNome(dados.nome ?? "");
        setLink(dados.link ?? "");
        setImagemUrl(dados.imagem ?? null);
        console.log(dados);
      } catch (err: any) {
        toast.error(err?.message || "Erro ao carregar serviço.");
        onClose();
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [servicoId, onClose, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagemFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", String(servicoId));
      formData.append("nome", nome);
      formData.append("link", link);
      if (imagemFile) formData.append("imagem", imagemFile);

      await updateServicoExterno(formData);
      toast.success("Serviço atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>Editar Serviço</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          
          <div style={{ marginTop: 12 }}>
            <label>Link:</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://exemplo.com"
              required
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Imagem:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div style={{ marginTop: 8 }}>
              {previewUrl ? (
                <>
                  <small>Preview nova:</small>
                  <img src={previewUrl} alt="preview" style={{ height: 80 }} />
                </>
              ) : imagemUrl ? (
                <>
                  <small>Imagem atual:</small>
                  <img src={imagemUrl} alt="atual" style={{ height: 80 }} />
                </>
              ) : (
                <small>Sem imagem</small>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: 8 }}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
