import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, productName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Confirmar Deleção</CardTitle>
          <CardDescription>
            Tem certeza que deseja apagar o produto "{productName}"? Esta ação não pode ser desfeita.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            onClick={onClose}
            className="bg-primary text-primary-foreground rounded-[var(--radius-sm)]"
          >
            Voltar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground rounded-[var(--radius-sm)]"
          >
            Confirmar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
