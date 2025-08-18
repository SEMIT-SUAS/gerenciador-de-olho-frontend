import React from "react";

interface ModalCadastroBannerProps {
  nome: string;
  setNome: (value: string) => void;
  imagem: File | null;
  setImagem: (file: File | null) => void;
  link: string;
  setLink: (value: string) => void;
  visivel: boolean;
  setVisivel: (value: boolean) => void;
  ativo: boolean;
  setAtivo: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  overlayStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export function ModalCadastroBanner({
  nome,
  setNome,
  imagem,
  setImagem,
  link,
  setLink,
  visivel,
  setVisivel,
  ativo,
  setAtivo,
  onSubmit,
  onClose,
  overlayStyle,
  contentStyle,
}: ModalCadastroBannerProps) {
  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <h3>Cadastrar Banner</h3>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files?.[0] || null)}
            required
          />

          <input
            type="text"
            placeholder="Link (opcional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <label>
            Visível:
            <input type="checkbox" checked={visivel} onChange={(e) => setVisivel(e.target.checked)} />
          </label>

          <label>
            Ativo:
            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
          </label>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="submit">Cadastrar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
