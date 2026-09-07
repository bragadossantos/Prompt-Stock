const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("promptstock_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    if (typeof window !== "undefined" && window.location.protocol === "https:" && url.startsWith("http://")) {
      throw new ApiError(
        0,
        "Bloqueio de Segurança (Mixed Content): O frontend na Vercel (HTTPS) não pode acessar uma API local insecure (HTTP). É necessário hospedar a API Laravel em um servidor HTTPS e configurar a variável NEXT_PUBLIC_API_URL na Vercel."
      );
    }
    throw new ApiError(
      0,
      `Não foi possível conectar ao servidor backend (${API_BASE_URL}). Verifique se o backend Laravel está ativo.`
    );
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      responseData?.message ||
      (responseData?.errors ? Object.values(responseData.errors).flat().join(" ") : null) ||
      `Erro na requisição: ${response.statusText}`;

    throw new ApiError(response.status, errorMessage, responseData);
  }

  return responseData;
}
