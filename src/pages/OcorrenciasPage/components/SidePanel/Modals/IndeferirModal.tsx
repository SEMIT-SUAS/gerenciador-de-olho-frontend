import { Loading } from '@/components/Loading/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

interface IndeferirModalProps {
  isOpen: boolean;
  title: string;
  isIndeferindoItem: boolean;
  suggestionMessages: string[];
  onConfirm: (motivo: string) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  reason: z.string().min(10, 'Informe um motivo com no mínimo 10 caracteres.'),
});

export function IndeferirModal({
  isOpen,
  title,
  isIndeferindoItem,
  suggestionMessages,
  onCancel,
  onConfirm,
}: IndeferirModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
    },
  });

  function handleCloseModal() {
    if (!isIndeferindoItem) {
      onCancel();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle aria-label={title}>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Sugestões de motivo:
            </p>
            <div className="flex flex-col gap-2">
              {suggestionMessages.map((message) => (
                <button
                  key={message}
                  type="button"
                  onClick={() =>
                    form.setValue('reason', message, { shouldValidate: true })
                  }
                  className="text-start px-3 py-1 text-xs text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form
              id="reason-form"
              onSubmit={form.handleSubmit((values) => onConfirm(values.reason))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o motivo detalhadamente..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>

          <Button type="submit" form="reason-form" disabled={isIndeferindoItem}>
            {isIndeferindoItem && <Loader2 className="animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
