type TagProps = {
  status: string;
};

import {
  IconCircleCheckFilled,
  IconLoader,
  IconProgressX,
  IconProgress,
  IconRotateClockwise2,
} from '@tabler/icons-react';

export function Tag({ status }: TagProps) {
  const styles: Record<string, string> = {
    aberto: 'bg-blue-100 text-blue-800',
    em_andamento: 'bg-yellow-100 text-yellow-800',
    indeferido: 'bg-red-100 text-red-800',
    concluido: 'bg-green-100 text-green-800',
    em_analise: 'bg-gray-100 text-gray-800',
  };

  const icon: Record<string, React.ReactNode> = {
    aberto: <IconLoader className="inline h-3.5" />,
    em_andamento: <IconRotateClockwise2 className="inline h-3.5" />,
    concluido: <IconCircleCheckFilled className="inline h-3.5" />,
    indeferido: <IconProgressX className="inline h-3.5" />,
    em_analise: <IconProgress className="inline h-3.5" />,
  };

  const defaultStyle = 'bg-gray-100 text-gray-800';

  const style = styles[status] || defaultStyle;

  return (
    <span
      className={`inline-flex w-fit text-xs font-medium pr-2 p-0.5 rounded-sm capitalize ${style} whitespace-nowrap items-center`}
    >
      {icon[status]}
      {status.replace('_', ' ')}
    </span>
  );
}
