"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import Providers from "@/components/providers";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Modal from "@/components/modal";
import DeleteModal from "@/components/deleteModal";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";

interface Product {
  id: string | number;
  name: string;
  price: number;
  amount: number;
  description: string;
}

interface DecodedToken {
  exp: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");

    if (!authToken) {
      router.push("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(authToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        sessionStorage.removeItem("authToken");
        router.push("/login");
        return;
      }

      async function loadProducts() {
        try {
          const data = await fetchProducts();
          setProducts(data);
        } catch (error: any) {
          toast.error(error.message || "Erro ao carregar produtos");
        } finally {
          setLoading(false);
        }
      }
      loadProducts();
    } catch (error) {
      sessionStorage.removeItem("authToken");
      router.push("/login");
    }
  }, [router]);

  const handleCreateProduct = async (data: Omit<Product, "id">) => {
    try {
      const newProduct = await createProduct(data);
      setProducts([...products, newProduct]);
      toast.success("Produto criado com sucesso!");
      setIsCreateModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar produto");
    }
  };

  const handleEditProduct = async (data: Omit<Product, "id">) => {
    if (!selectedProduct) return;
    try {
      const updatedProduct = await updateProduct(selectedProduct.id, data);
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      toast.success("Produto atualizado com sucesso!");
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar produto");
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      toast.success("Produto deletado com sucesso!");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar produto");
    }
  };

  const handleBuy = async (product: Product) => {
    setBuyingId(product.id);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success(`Compra realizada: ${product.name}`);
    } catch {
      toast.error("Erro na compra");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <ThemeProvider>
      <Providers>
        <main className="min-h-auto bg-background text-foreground px-4 py-8">
          <div className="flex justify-end items-center mb-8">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-primary-foreground rounded-[var(--radius-sm)]"
            >
              Adicionar Produto
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center mt-16">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground mt-16">
              Nenhum produto disponível.
            </p>
          ) : (
            <div className="grid gap-6 max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(({ id, name, price, amount, description }) => (
                <Card key={id} className="flex flex-col justify-between">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>{name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedProduct({
                            id,
                            name,
                            price,
                            amount,
                            description,
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="bg-primary text-primary-foreground rounded-[var(--radius-sm)] text-sm py-1 px-2"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedProduct({
                            id,
                            name,
                            price,
                            amount,
                            description,
                          });
                          setIsDeleteModalOpen(true);
                        }}
                        className="bg-destructive text-destructive-foreground rounded-[var(--radius-sm)] text-sm py-1 px-2"
                      >
                        Apagar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mt-2">
                      {description}
                    </CardDescription>
                    <p className="mb-2 font-semibold text-lg">
                      R$ {price.toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {amount}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() =>
                        amount > 0
                          ? handleBuy({ id, name, price, amount, description })
                          : undefined
                      }
                      disabled={amount === 0 || buyingId === id}
                      className="w-full rounded-[var(--radius-sm)] cursor-pointer"
                    >
                      {buyingId === id ? (
                        <Loader />
                      ) : amount > 0 ? (
                        "Comprar"
                      ) : (
                        "Esgotado"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateProduct}
            title="Adicionar Produto"
          />
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleEditProduct}
            initialData={selectedProduct || undefined}
            title="Editar Produto"
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
            }}
            onConfirm={handleDeleteProduct}
            productName={selectedProduct?.name || ""}
          />
        </main>
      </Providers>
    </ThemeProvider>
  );
}
