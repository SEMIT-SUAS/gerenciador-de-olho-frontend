import { cn } from '@/lib/utils';
import { StatusIcon } from '@/constants/StatusIcon';
import { Badge } from '@/components/ui/badge';

type TagProps = {
  status: string;
};

export function Tag({ status }: TagProps) {
  const styles: Record<string, string> = {
    aberto: 'bg-blue-100 text-blue-800',
    andamento: 'bg-yellow-100 text-yellow-800',
    indeferido: 'bg-red-100 text-red-800',
    concluído: 'bg-green-100 text-green-800',
    análise: 'bg-gray-100 text-gray-800',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800';
  const style = styles[status.toLowerCase()] || defaultStyle;

  return (
    <Badge className={cn(style)}>
      {StatusIcon[status]}
      {status}
    </Badge>
  );
}
