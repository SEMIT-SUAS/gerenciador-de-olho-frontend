import type { AcaoHistory } from '@/types/Acao';

interface TimelineProps {
  acaoHistory: AcaoHistory[];
}

export function Timeline({ acaoHistory }: TimelineProps) {
  return (
    <div className="relative ps-4 border-s-2 border-gray-200 space-y-8">
      {acaoHistory.map((acao, index) => (
        <div key={index} className="relative">
          {/* Bolinha minimalista */}
          <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>

          {/* Conteúdo */}
          <div className="pl-4">
            <h3 className="text-md font-semibold text-gray-900">
              {acao.status}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              {new Date(acao.dataModificacao).toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">{acao.motivo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
