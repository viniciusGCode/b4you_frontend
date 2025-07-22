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
        sessionStorage.removeItem("token");
        router.push("/login");
        return;
      }

      async function fetchProducts() {
        try {
          const res = await fetch(
            "https://b4youbackend-production.up.railway.app/products"
          );
          if (!res.ok) throw new Error("Falha ao carregar produtos");
          const data: Product[] = await res.json();
          setProducts(data);
        } catch (error: any) {
          toast.error(error.message || "Erro ao carregar produtos");
        } finally {
          setLoading(false);
        }
      }
      fetchProducts();
    } catch (error) {
      // Se houver erro na decodificação do token, redirecionar para login
      sessionStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

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
          <div className="flex justify-between items-center mb-8"></div>

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
                  <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription className="mt-2">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
        </main>
      </Providers>
    </ThemeProvider>
  );
}
