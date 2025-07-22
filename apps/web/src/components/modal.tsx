import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string | number;
  name: string;
  price: number;
  amount: number;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">) => void;
  initialData?: Product;
  title: string;
}

export default function Modal({ isOpen, onClose, onSubmit, initialData, title }: ModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    amount: initialData?.amount || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-input bg-background text-foreground rounded-[var(--radius-sm)] px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border-input bg-background text-foreground rounded-[var(--radius-sm)] px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                className="w-full border-input bg-background text-foreground rounded-[var(--radius-sm)] px-3 py-2"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Quantidade
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseInt(e.target.value) })
                }
                className="w-full border-input bg-background text-foreground rounded-[var(--radius-sm)] px-3 py-2"
                required
                min="0"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-muted text-muted-foreground rounded-[var(--radius-sm)]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground rounded-[var(--radius-sm)]"
            >
              Salvar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
