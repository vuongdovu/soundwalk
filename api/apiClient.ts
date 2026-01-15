import TokenService from "@/services/TokenService";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
  credentials?: "omit" | "same-origin" | "include";
};

let refreshPromise: Promise<void> | null = null;
let lastRefreshAt: number | null = null;
const REFRESH_COOLDOWN_MS = 5000; 

function getCsrfToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

class AuthExpiredError extends Error {
  constructor(message = "Session expired. Please log in again.") {
    super(message);
    this.name = "AuthExpiredError";
  }
}

async function ensureFreshSession() {
  if (refreshPromise) return refreshPromise;

  const now = Date.now();
  if (lastRefreshAt && now - lastRefreshAt < REFRESH_COOLDOWN_MS) {
    throw new AuthExpiredError();
  }

  refreshPromise = refreshToken()
    .then(() => {
      lastRefreshAt = Date.now();
    })
    .catch((err) => {
      lastRefreshAt = Date.now();
      throw err;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function parseError(res: Response) {
  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    // ignore JSON parse errors
  }
  return payload?.detail ?? `Request failed: ${res.status}`;
}

function isPublicAuthPath(path: string) {
  return (
    path.includes("/auth/login/") ||
    path.includes("/auth/google/") ||
    path.includes("/auth/registeration/")
  );
}

// Prefer env var so the client points at the Django API.
// const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost";
const rawBaseUrl = "http://10.0.0.159"
// Ensure we always have a protocol; allows users to set either "http://localhost:8000" or "localhost:8000".
const BASE_URL = rawBaseUrl.startsWith("http") ? rawBaseUrl : `http://${rawBaseUrl}`;

async function refreshToken(): Promise<void> {
  const refresh = await TokenService.getRefreshToken();
  if (!refresh) throw new AuthExpiredError();

  const res = await fetch(`${BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!res.ok) throw res;
  const data = await res.json().catch(() => ({}));
  if (data?.access) {
    await TokenService.setAccessToken(data.access);
  }
  if (data?.refresh) {
    await TokenService.setRefreshToken(data.refresh);
  }
}

export async function apiClient<T>(
  path: string, 
  opts: RequestOptions = {}
): Promise<T> {
  const attempt = async () => {
    const csrf = getCsrfToken();
    const token =
      opts.token === undefined
        ? isPublicAuthPath(path)
          ? null
          : await TokenService.getAccessToken()
        : opts.token;
    const isForm = isFormData(opts.body);
    const hasBody = opts.body !== undefined && opts.body !== null;
    const body = !hasBody
      ? undefined
      : isForm
        ? opts.body
        : typeof opts.body === "string"
          ? opts.body
          : JSON.stringify(opts.body);
    const res = await fetch(`${BASE_URL}${path}`, {
      method: opts.method ?? "GET",
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(csrf ? { "X-CSRFToken": csrf } : {}),
        ...(opts.headers ?? {}),
      },
      body,
      // For Next caching control (choose your strategy):
      cache: "no-store",
    });
    if (res.status === 204) return undefined as T;
    if (!res.ok) throw res;
    return (await res.json()) as T;
  };

    try {
      return await attempt();
    } catch (err: any) {
      const res: Response | undefined = err instanceof Response ? err : err?.res;

    if (res?.status === 401) {
      if (isPublicAuthPath(path)) {
        throw new Error(await parseError(res));
      }

      // If refresh itself failed, surface an auth-expired error.
      if (path.includes("/refresh/")) {
        throw new AuthExpiredError();
      }

      try {
        await ensureFreshSession();
        return attempt();
      } catch (refreshErr: any) {
        if (refreshErr instanceof AuthExpiredError) {
          throw refreshErr;
        }

        const refreshRes: Response | undefined =
          refreshErr instanceof Response ? refreshErr : refreshErr?.res;
        if (refreshRes?.status === 401) {
          throw new AuthExpiredError();
        }
        if (refreshRes) {
          throw new Error(await parseError(refreshRes));
        }
        throw refreshErr instanceof Error
          ? refreshErr
          : new Error("Failed to refresh session. Please try again.");
      }
    }

    if (res) {
      throw new Error(await parseError(res));
    }

    throw err instanceof Error ? err : new Error("Unknown request error");
  }
}
