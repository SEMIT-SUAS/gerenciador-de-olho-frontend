import type { Banner } from "../../../types/Banners";
import { BannerCard } from "./BannerCard";

interface BannerGridProps {
  banners: Banner[];
  onToggle: () => void;
}

export function BannerGrid({ banners,  onToggle }: BannerGridProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {banners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} onToggle={onToggle} />
      ))}
    </div>
  );
}
