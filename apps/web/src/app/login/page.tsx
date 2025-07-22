"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://b4youbackend-production.up.railway.app/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      const token = data.token;

      if (!token) throw new Error("Token not found");

      const expiresAt = Date.now() + 1 * 60 * 60 * 1000;
      sessionStorage.setItem("authToken", JSON.stringify({ token, expiresAt }));

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <Providers>
        <main className="min-h-auto flex flex-col items-center justify-center bg-background text-foreground px-4 py-8">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold text-center mb-6">Login</CardTitle>
              <CardDescription className="text-center text-muted-foreground mb-4">
                Entre com seu usuário e senha para acessar o sistema.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <input
                type="email"
                placeholder="Usuário"
                className="w-full mb-4 p-3 rounded-[var(--radius-sm)] border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full mb-2 p-3 rounded-[var(--radius-sm)] border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={handleLogin}
                disabled={loading || !username || !password}
                className="w-full bg-primary text-primary-foreground font-semibold rounded-[var(--radius-sm)] py-3 hover:opacity-90 transition cursor-pointer"
              >
                {loading ? <Loader /> : "Entrar"}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </Providers>
    </ThemeProvider>
  );
}
