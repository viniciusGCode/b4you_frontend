import axios from "axios";

interface Product {
  id: string | number;
  name: string;
  price: number;
  amount: number;
  description: string;
}

interface AuthToken {
  token: string;
  expiresAt: number;
}

export async function fetchProducts(): Promise<Product[]> {
  const authTokenRaw = sessionStorage.getItem("authToken");
  if (!authTokenRaw) {
    throw new Error("Token de autenticação não encontrado");
  }

  let authToken: AuthToken;
  try {
    authToken = JSON.parse(authTokenRaw);
  } catch {
    throw new Error("Token de autenticação inválido");
  }

  const currentTime = Date.now();
  if (authToken.expiresAt < currentTime) {
    sessionStorage.removeItem("authToken");
    throw new Error("Token de autenticação expirado");
  }

  try {
    const response = await axios.get(
      "https://b4youbackend-production.up.railway.app/products",
      {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Falha ao carregar produtos");
  }
}

export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  const authTokenRaw = sessionStorage.getItem("authToken");
  if (!authTokenRaw) {
    throw new Error("Token de autenticação não encontrado");
  }

  let authToken: AuthToken;
  try {
    authToken = JSON.parse(authTokenRaw);
  } catch {
    throw new Error("Token de autenticação inválido");
  }

  const currentTime = Date.now();
  if (authToken.expiresAt < currentTime) {
    sessionStorage.removeItem("authToken");
    throw new Error("Token de autenticação expirado");
  }

  try {
    const response = await axios.post(
      "https://b4youbackend-production.up.railway.app/products",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Falha ao criar produto");
  }
}

export async function updateProduct(
  id: string | number,
  data: Omit<Product, "id">
): Promise<Product> {
  const authTokenRaw = sessionStorage.getItem("authToken");
  if (!authTokenRaw) {
    throw new Error("Token de autenticação não encontrado");
  }

  let authToken: AuthToken;
  try {
    authToken = JSON.parse(authTokenRaw);
  } catch {
    throw new Error("Token de autenticação inválido");
  }

  const currentTime = Date.now();
  if (authToken.expiresAt < currentTime) {
    sessionStorage.removeItem("authToken");
    throw new Error("Token de autenticação expirado");
  }

  try {
    const response = await axios.put(
      `https://b4youbackend-production.up.railway.app/products/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Falha ao atualizar produto");
  }
}

export async function deleteProduct(id: string | number): Promise<void> {
  const authTokenRaw = sessionStorage.getItem("authToken");
  if (!authTokenRaw) {
    throw new Error("Token de autenticação não encontrado");
  }

  let authToken: AuthToken;
  try {
    authToken = JSON.parse(authTokenRaw);
  } catch {
    throw new Error("Token de autenticação inválido");
  }

  const currentTime = Date.now();
  if (authToken.expiresAt < currentTime) {
    sessionStorage.removeItem("authToken");
    throw new Error("Token de autenticação expirado");
  }

  try {
    await axios.delete(
      `https://b4youbackend-production.up.railway.app/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      }
    );
  } catch (error) {
    throw new Error("Falha ao deletar produto");
  }
}