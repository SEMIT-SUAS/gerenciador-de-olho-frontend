import {
  IconCircleCheckFilled,
  IconLoader,
  IconProgress,
  IconProgressX,
  IconRotateClockwise2,
} from '@tabler/icons-react';

export const StatusIcon: Record<string, React.ReactNode> = {
  aberto: <IconLoader className="inline h-3.5" />,
  em_andamento: <IconRotateClockwise2 className="inline h-3.5" />,
  concluido: <IconCircleCheckFilled className="inline h-3.5" />,
  indeferido: <IconProgressX className="inline h-3.5" />,
  em_analise: <IconProgress className="inline h-3.5" />,
};
