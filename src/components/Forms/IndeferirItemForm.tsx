import { useState } from 'react';

interface IndeferiItemFormProps {
  onSubmit: (reason: string) => void;
  title: string;
  description: string;
  messages: string[];
}

export function IndeferiItemForm({
  onSubmit,
  title,
  description,
  messages,
}: IndeferiItemFormProps) {
  const [reason, setReason] = useState('');

  function handleOnClickButton() {
    if (!reason) return;
    onSubmit(reason);
  }

  return (
    <div className="flex flex-col h-full p-1">
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">Você está indeferindo o item:</p>
        <p className="font-bold text-red-900">{title}</p>
        <p className="text-sm font-medium text-red-800">{description}</p>
      </div>

      <div className="flex-1 flex flex-col space-y-5">
        <div>
          <label
            htmlFor="motivo-indeferimento"
            className="block font-semibold text-slate-800 mb-2"
          >
            Motivo do Indeferimento:
          </label>
          <textarea
            id="motivo-indeferimento"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={6}
            className="w-full resize-none border-slate-300 rounded-md shadow-sm p-3 text-slate-700 text-sm
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Descreva claramente o motivo para o indeferimento..."
          />
        </div>

        <div>
          <h4 className="text-slate-800 font-semibold mb-3">
            Mensagens Rápidas
          </h4>
          <div className="flex flex-wrap gap-2">
            {messages.map((message) => (
              <button
                key={message}
                onClick={() => setReason(message)}
                className="px-3 py-1.5 text-xs text-start border border-slate-300 rounded-full text-slate-600 
                           hover:bg-slate-100 hover:border-slate-400 transition-colors"
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-6">
        <button
          onClick={handleOnClickButton}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-lg transition-colors
                     hover:bg-red-700
                     disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          Confirmar Indeferimento
        </button>
      </footer>
    </div>
  );
}
