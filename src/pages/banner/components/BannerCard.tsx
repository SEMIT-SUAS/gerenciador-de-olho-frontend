// BannerCard.tsx
import type { Banner } from "../../../types/Banners";
import { changeBannerVisibility } from "../../../services/bannersService";
import { toast } from "react-toastify";

interface BannerCardProps {
  banner: Banner;
  onToggle: () => void;
}

export function BannerCard({ banner, onToggle }: BannerCardProps) {

  const toggleVisibility = async () => {
    try {
      await changeBannerVisibility(banner.id, !banner.visivel);
      toast.success("Visibilidade atualizada com sucesso!");
      onToggle(); // Atualiza a lista
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar visibilidade.");
    }
  };

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
      <button onClick={toggleVisibility}>
        {banner.visivel ? "Ocultar" : "Exibir"}
      </button>
    </div>
  );
}
