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

  const res = await fetch(
    "https://b4youbackend-production.up.railway.app/products",
    {
      headers: {
        Authorization: `Bearer ${authToken.token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Falha ao carregar produtos");
  return res.json();
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

  const res = await fetch(
    "https://b4youbackend-production.up.railway.app/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Falha ao criar produto");
  return res.json();
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

  const res = await fetch(
    `https://b4youbackend-production.up.railway.app/products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Falha ao atualizar produto");
  return res.json();
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

  const res = await fetch(
    `https://b4youbackend-production.up.railway.app/products/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken.token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Falha ao deletar produto");
}
