import { TailSpin } from "react-loader-spinner";

export function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <TailSpin height="50" width="50" color="#007bff" />
      <p style={{ marginTop: "12px" }}>Carregando...</p>
    </div>
  );
}
