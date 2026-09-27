/**
 * Acesso ao livro de assinaturas via API REST do Supabase.
 *
 * A chave abaixo é a *publishable* — ela existe para ficar exposta no browser;
 * quem protege os dados é o RLS da tabela, não o segredo da chave. Por isso ela
 * mora no código em vez de uma env var: o deploy atual não tem como receber
 * variáveis (CLI da Vercel deslogado), e nada se perde em segurança.
 *
 * O que a chave permite, e só isso:
 *   - ler assinaturas já aprovadas
 *   - inserir uma assinatura nova, sempre com approved = false
 * Nenhum update, nenhum delete, nenhuma outra tabela.
 */

const URL = "https://gtzfdpvmbaeskwlldtsu.supabase.co";
const KEY = "sb_publishable_fMZFzPMdZKCWwwj4-QNujw_VoSPJaQW";
const TABLE = "portfolio_signatures";

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
};

export type Signature = {
  name: string;
  relation: string | null;
  message: string | null;
  link: string | null;
  /** JSON dos traçados; ver lib/signature.ts */
  signature: string | null;
  created_at: string;
};

export type NewSignature = {
  name: string;
  relation: string;
  message: string;
  link: string;
  signature: string | null;
};

/** Limites espelhados dos CHECK constraints da tabela. */
export const LIMITS = {
  name: 60,
  relation: 40,
  message: 280,
  link: 180,
};

export async function fetchSignatures(signal?: AbortSignal): Promise<Signature[]> {
  const qs = new URLSearchParams({
    select: "name,relation,message,link,signature,created_at",
    order: "created_at.desc",
    limit: "60",
  });

  const res = await fetch(`${URL}/rest/v1/${TABLE}?${qs}`, { headers, signal });
  if (!res.ok) throw new Error(`read failed: ${res.status}`);
  return res.json();
}

/* ── moderação (exige sessão do dono; o RLS confere o e-mail no banco) ──── */

export type ModSignature = Signature & {
  id: string;
  approved: boolean;
  review_note: string | null;
};

function authHeaders(token: string) {
  return { apikey: KEY, Authorization: `Bearer ${token}` };
}

/** Todas as assinaturas, publicadas e retidas. Só o dono enxerga as retidas. */
export async function fetchAllSignatures(token: string): Promise<ModSignature[]> {
  const qs = new URLSearchParams({
    select: "id,name,relation,message,link,signature,approved,review_note,created_at",
    order: "created_at.desc",
    limit: "200",
  });

  const res = await fetch(`${URL}/rest/v1/${TABLE}?${qs}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`read failed: ${res.status}`);
  return res.json();
}

export async function setApproved(token: string, id: string, approved: boolean): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...authHeaders(token), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ approved }),
  });
  if (!res.ok) throw new Error(`update failed: ${res.status}`);
}

export async function deleteSignature(token: string, id: string): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeaders(token), Prefer: "return=minimal" },
  });
  if (!res.ok) throw new Error(`delete failed: ${res.status}`);
}

export async function submitSignature(input: NewSignature): Promise<void> {
  const link = input.link.trim();
  const message = input.message.trim();

  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: input.name.trim(),
      relation: input.relation.trim() || null,
      message: message || null,
      link: link || null,
      signature: input.signature,
      approved: false,
    }),
  });

  if (!res.ok) {
    // 400 aqui costuma ser um CHECK constraint reprovando a entrada
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `write failed: ${res.status}`);
  }
}
