// BannerCard.tsx
import type { Banner } from "../../../types/Banners";

interface BannerCardProps {
  banner: Banner;
}

export function BannerCard({ banner }: BannerCardProps) {
  return (
    <div
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
  );
}
