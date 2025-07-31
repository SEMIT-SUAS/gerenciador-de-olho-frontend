// BannerGrid.tsx
import type { Banner } from "../../../types/Banners";
import { BannerCard } from "./BannerCard";

interface BannerGridProps {
  banners: Banner[];
}

export function BannerGrid({ banners }: BannerGridProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {banners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
}
