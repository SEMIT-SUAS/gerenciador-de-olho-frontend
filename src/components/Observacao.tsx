type ObservacaoProps = {
  text: string;
  color: 'blue' | 'yellow' | 'red';
};

export function Observacao({ text, color }: ObservacaoProps) {
  const border = {
    blue: 'border-blue-200',
    yellow: 'border-yellow-200',
    red: 'border-red-200',
  };

  const bgColor = {
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
  };

  const textColor = {
    blue: 'text-blue-800',
    yellow: 'text-yellow-800',
    red: 'text-red-800',
  };

  return (
    <div
      className={`flex items-center p-3 ${bgColor[color]} rounded-xl border ${border[color]}`}
    >
      <p className={`text-sm font-semibold ${textColor[color]}`}>{text}</p>
    </div>
  );
}
