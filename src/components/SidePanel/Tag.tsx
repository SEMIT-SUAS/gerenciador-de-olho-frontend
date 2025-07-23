type TagProps = {
  status: string;
};

export function Tag({ status }: TagProps) {
  const styles: Record<string, string> = {
    aberto: 'bg-blue-100 text-blue-800',
    em_andamento: 'bg-yellow-100 text-yellow-800',
    indeferido: 'bg-red-100 text-red-800',
    concluido: 'bg-green-100 text-green-800',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800';

  const style = styles[status] || defaultStyle;

  return (
    <span
      className={`w-fit text-xs font-medium px-2 py-1 rounded-md capitalize ${style} whitespace-nowrap`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
