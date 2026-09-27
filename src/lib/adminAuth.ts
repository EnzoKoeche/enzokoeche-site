/**
 * Login por magic link para a tela de moderação.
 *
 * Sem SDK: o fluxo do Supabase Auth cabe em poucas chamadas REST, e manter o
 * projeto sem dependências vale mais aqui do que a conveniência.
 *
 * Como funciona:
 *   1. Pede o link  → POST /auth/v1/otp
 *   2. O email leva a /admin#access_token=…&refresh_token=…
 *   3. Guardamos a sessão e limpamos o hash da URL (token não fica no histórico)
 *   4. Perto de expirar, renovamos com o refresh_token
 *
 * Não existe senha de admin em lugar nenhum: quem entra é quem recebe o email.
 * E mesmo com um token válido de outra conta, o RLS confere o e-mail dentro do
 * banco — a tela não é a fronteira de segurança, o Postgres é.
 */

const URL = "https://gtzfdpvmbaeskwlldtsu.supabase.co";
const KEY = "sb_publishable_fMZFzPMdZKCWwwj4-QNujw_VoSPJaQW";
const STORAGE = "ekc-admin-session";

export type Session = {
  access_token: string;
  refresh_token: string;
  /** epoch ms */
  expires_at: number;
  email: string | null;
};

function decodeEmail(jwt: string): string | null {
  try {
    const payload = jwt.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).email ?? null;
  } catch {
    return null;
  }
}

function save(s: Session) {
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(s));
  } catch {
    // modo privado: a sessão vale só enquanto a aba estiver aberta
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(STORAGE);
  } catch {
    /* nada a fazer */
  }
}

function read(): Session | null {
  try {
    const raw = window.localStorage.getItem(STORAGE);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s?.access_token || !s?.refresh_token) return null;
    return s;
  } catch {
    return null;
  }
}

/** Lê os tokens do fragmento da URL após o clique no email, se houver. */
export function sessionFromUrl(): Session | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.includes("access_token")) return null;

  const p = new URLSearchParams(hash);
  const access_token = p.get("access_token");
  const refresh_token = p.get("refresh_token");
  if (!access_token || !refresh_token) return null;

  const expiresIn = Number(p.get("expires_in") ?? 3600);
  const s: Session = {
    access_token,
    refresh_token,
    expires_at: Date.now() + expiresIn * 1000,
    email: decodeEmail(access_token),
  };

  save(s);
  // tira o token da barra de endereços — ele não deve sobreviver no histórico
  window.history.replaceState(null, "", window.location.pathname);
  return s;
}

async function refresh(s: Session): Promise<Session | null> {
  const res = await fetch(`${URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: s.refresh_token }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.access_token) return null;

  const next: Session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? s.refresh_token,
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
    email: decodeEmail(data.access_token),
  };
  save(next);
  return next;
}

/**
 * Sessão utilizável agora. Renova sozinha se estiver perto de vencer, para o
 * token não expirar no meio de uma moderação.
 */
export async function getSession(): Promise<Session | null> {
  const fromUrl = sessionFromUrl();
  if (fromUrl) return fromUrl;

  const s = read();
  if (!s) return null;

  if (s.expires_at - Date.now() < 5 * 60 * 1000) {
    const renewed = await refresh(s);
    if (!renewed) {
      clearSession();
      return null;
    }
    return renewed;
  }
  return s;
}

export async function sendMagicLink(email: string, redirectTo: string): Promise<void> {
  const res = await fetch(`${URL}/auth/v1/otp`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      create_user: true,
      options: { email_redirect_to: redirectTo },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `otp failed: ${res.status}`);
  }
}

export async function signOut(s: Session) {
  clearSession();
  // best-effort: invalida o refresh token no servidor também
  await fetch(`${URL}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${s.access_token}` },
  }).catch(() => {});
}
