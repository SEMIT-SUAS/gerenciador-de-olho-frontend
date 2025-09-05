// src/hooks/useReorder.ts

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';

// Definimos uma interface para garantir que os itens da lista tenham um 'id'
interface ItemWithId {
  id: number | string;
}

interface UseReorderProps<T extends ItemWithId> {
  items: T[] | null;
  setItems: Dispatch<SetStateAction<T[] | null>>;
  onSaveOrder: (itemId: number, newPosition: number) => Promise<void>;
}

export function useReorder<T extends ItemWithId>({
  items,
  setItems,
  onSaveOrder,
}: UseReorderProps<T>) {
  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      // Validações iniciais
      if (!result.destination || !items) {
        return;
      }

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      if (sourceIndex === destinationIndex) {
        return;
      }

      // 1. Guarda o estado original para o rollback em caso de erro
      const originalItems = [...items];

      // 2. Cria a nova lista reordenada localmente
      const reorderedItems = Array.from(items);
      const [movedItem] = reorderedItems.splice(sourceIndex, 1);
      reorderedItems.splice(destinationIndex, 0, movedItem);

      // 3. Atualização otimista: atualiza a UI imediatamente
      setItems(reorderedItems);

      const itemId = Number(result.draggableId);
      const newPosition = destinationIndex + 1;

      try {
        // 4. Em segundo plano, chama a função para salvar no backend
        await onSaveOrder(itemId, newPosition);
      } catch (error) {
        // 5. Em caso de erro, exibe notificação e reverte a UI
        toast.error('Não foi possível salvar a nova ordem. Tente novamente.');
        setItems(originalItems);
      }
    },
    [items, setItems, onSaveOrder],
  ); // Dependências do useCallback

  return { handleDragEnd };
}
