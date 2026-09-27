"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import SignatureView from "@/components/SignatureView";
import { parse } from "@/lib/signature";
import {
  deleteSignature,
  fetchAllSignatures,
  setApproved,
  type ModSignature,
} from "@/lib/supabase";
import {
  getSession,
  sendMagicLink,
  signOut,
  type Session,
} from "@/lib/adminAuth";

type Phase = "checking" | "anon" | "sent" | "ready" | "denied";

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function AdminClient() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<ModSignature[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const load = useCallback(async (s: Session) => {
    try {
      const rows = await fetchAllSignatures(s.access_token);
      setItems(rows);
      setPhase("ready");
    } catch {
      // Token válido mas sem permissão = e-mail não é o do dono. O RLS decidiu,
      // não a interface — por isso dá para confiar nesta mensagem.
      setPhase("denied");
    }
  }, []);

  useEffect(() => {
    let vivo = true;
    getSession().then((s) => {
      if (!vivo) return;
      if (!s) {
        setPhase("anon");
        return;
      }
      setSession(s);
      load(s);
    });
    return () => {
      vivo = false;
    };
  }, [load]);

  async function pedirLink(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    try {
      await sendMagicLink(email, `${window.location.origin}/admin`);
      setPhase("sent");
    } catch {
      setErro("Não consegui enviar o link. Confere o e-mail e tenta de novo.");
    }
  }

  async function agir(id: string, acao: "publicar" | "ocultar" | "remover") {
    if (!session) return;
    if (acao === "remover" && !window.confirm("Remover esta assinatura de vez?")) return;

    setBusy(id);
    setErro(null);
    try {
      if (acao === "remover") {
        await deleteSignature(session.access_token, id);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        const alvo = acao === "publicar";
        await setApproved(session.access_token, id, alvo);
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, approved: alvo } : i)));
      }
    } catch {
      setErro("A ação falhou. Recarrega a página e tenta de novo.");
    } finally {
      setBusy(null);
    }
  }

  /* ── telas de acesso ─────────────────────────────────────────────────── */

  if (phase === "checking") {
    return (
      <main className="mx-auto max-w-md px-6 py-32">
        <p className="label">verificando sessão…</p>
      </main>
    );
  }

  if (phase === "anon" || phase === "sent") {
    return (
      <main className="mx-auto max-w-md px-6 py-32">
        <h1 className="font-display text-2xl font-light text-ink">Moderação</h1>

        {phase === "sent" ? (
          <div className="mt-6 space-y-3">
            <p className="text-[15px] leading-relaxed text-muted">
              Link enviado para <span className="text-accent">{email}</span>. Abre o e-mail e
              clica — você volta para cá já autenticado.
            </p>
            <button
              onClick={() => setPhase("anon")}
              className="underline-grow font-mono text-[13px] text-muted transition-colors hover:text-accent"
            >
              usar outro e-mail
            </button>
          </div>
        ) : (
          <form onSubmit={pedirLink} className="mt-6 space-y-5">
            <label htmlFor="adm-email" className="block">
              <span className="label mb-1 block">Seu e-mail</span>
              <input
                id="adm-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full border-b border-white/12 bg-transparent py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
              />
            </label>

            <button
              type="submit"
              className="underline-grow font-mono text-sm text-ink transition-colors hover:text-accent"
            >
              Receber link →
            </button>

            {erro && <p className="font-mono text-[13px] text-accent">{erro}</p>}
            <p className="label !text-faint">Sem senha. O link chega no e-mail e expira.</p>
          </form>
        )}
      </main>
    );
  }

  if (phase === "denied") {
    return (
      <main className="mx-auto max-w-md px-6 py-32">
        <h1 className="font-display text-2xl font-light text-ink">Sem acesso</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Esta conta não modera este site.
        </p>
        <button
          onClick={() => {
            if (session) signOut(session);
            setSession(null);
            setPhase("anon");
          }}
          className="underline-grow mt-6 font-mono text-[13px] text-muted transition-colors hover:text-accent"
        >
          entrar com outra conta
        </button>
      </main>
    );
  }

  /* ── moderação ───────────────────────────────────────────────────────── */

  const retidas = items.filter((i) => !i.approved);
  const publicadas = items.filter((i) => i.approved);

  function Card({ s }: { s: ModSignature }) {
    const strokes = parse(s.signature);
    const trabalhando = busy === s.id;

    return (
      <li className={`rule py-6 ${trabalhando ? "opacity-50" : ""}`}>
        {strokes ? (
          <SignatureView strokes={strokes} className="mb-3 h-24 w-full text-ink" />
        ) : (
          <p className="label mb-3">sem desenho</p>
        )}

        {s.message && <p className="text-[15px] leading-relaxed text-muted">“{s.message}”</p>}

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-[13px] text-accent">{s.name}</span>
          {s.relation && <span className="label">{s.relation}</span>}
          <span className="label !text-faint ml-auto">{fmt(s.created_at)}</span>
        </div>

        {s.link && (
          <a
            href={s.link}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className="underline-grow mt-1 inline-block font-mono text-[12px] text-muted"
          >
            {s.link} ↗
          </a>
        )}

        {s.review_note && (
          <p className="mt-2 font-mono text-[12px] text-accent">filtro: {s.review_note}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-5">
          <button
            disabled={trabalhando}
            onClick={() => agir(s.id, s.approved ? "ocultar" : "publicar")}
            className="label transition-colors hover:!text-accent disabled:!text-white/15"
          >
            {s.approved ? "Ocultar" : "Publicar"}
          </button>
          <button
            disabled={trabalhando}
            onClick={() => agir(s.id, "remover")}
            className="label transition-colors hover:!text-accent disabled:!text-white/15"
          >
            Remover
          </button>
        </div>
      </li>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <header className="rule flex flex-wrap items-baseline justify-between gap-4 pt-6">
        <h1 className="font-display text-2xl font-light text-ink">Moderação</h1>
        <div className="flex items-center gap-5">
          <span className="label">{session?.email}</span>
          <button
            onClick={() => {
              if (session) signOut(session);
              setSession(null);
              setPhase("anon");
            }}
            className="label transition-colors hover:!text-accent"
          >
            sair
          </button>
        </div>
      </header>

      {erro && <p className="mt-6 font-mono text-[13px] text-accent">{erro}</p>}

      <section className="mt-12">
        <p className="label mb-2">
          Retidas pelo filtro · {retidas.length}
        </p>
        {retidas.length === 0 ? (
          <p className="rule py-6 font-mono text-[13px] text-faint">Nada esperando revisão.</p>
        ) : (
          <ul>
            {retidas.map((s) => (
              <Card key={s.id} s={s} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <p className="label mb-2">No livro · {publicadas.length}</p>
        {publicadas.length === 0 ? (
          <p className="rule py-6 font-mono text-[13px] text-faint">Nenhuma publicada ainda.</p>
        ) : (
          <ul>
            {publicadas.map((s) => (
              <Card key={s.id} s={s} />
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/"
        className="underline-grow mt-16 inline-block font-mono text-[13px] text-muted transition-colors hover:text-accent"
      >
        ← voltar ao site
      </Link>
    </main>
  );
}
