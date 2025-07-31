type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Pesquisar por nome..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ marginBottom: "1rem", padding: "6px", width: "100%" }}
    />
  );
}
