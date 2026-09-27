"use client";

import { useEffect, useRef, useState } from "react";
import { guestbook } from "@/lib/content";
import { MAX_SERIALIZED, parse, serialize, type Strokes } from "@/lib/signature";
import {
  LIMITS,
  fetchSignatures,
  submitSignature,
  type NewSignature,
  type Signature,
} from "@/lib/supabase";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SignaturePad from "./SignaturePad";
import SignatureView from "./SignatureView";

const EMPTY: NewSignature = { name: "", relation: "", message: "", link: "", signature: null };

type Status = "idle" | "sending" | "sent" | "held" | "error";

function formatDate(iso: string, lang: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  max,
  required,
  type = "text",
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  max: number;
  required?: boolean;
  type?: string;
  multiline?: boolean;
}) {
  const id = `gb-${label.replace(/\W+/g, "-").toLowerCase()}`;
  const shared =
    "w-full border-b border-white/12 bg-transparent py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent";

  return (
    <label htmlFor={id} className="block">
      <span className="label flex items-baseline justify-between gap-3">
        {label}
        {value.length > max * 0.7 && (
          <span className={value.length > max ? "text-accent" : ""}>
            {value.length}/{max}
          </span>
        )}
      </span>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          required={required}
          maxLength={max}
          rows={2}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-none leading-relaxed`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          maxLength={max}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
        />
      )}
    </label>
  );
}

export default function Guestbook() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<Signature[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [form, setForm] = useState<NewSignature>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [padKey, setPadKey] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const ac = new AbortController();

    fetchSignatures(ac.signal)
      .then((rows) => {
        if (alive.current) setItems(rows);
      })
      .catch((err) => {
        if (err?.name === "AbortError" || !alive.current) return;
        setLoadFailed(true);
      });

    return () => {
      alive.current = false;
      ac.abort();
    };
  }, []);

  const set = (k: keyof NewSignature) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function onStrokes(strokes: Strokes) {
    // Guarda como veio; o teto é conferido em `tooBig`, que desabilita o envio
    // antes que o CHECK do banco rejeite com um 400 seco.
    setForm((f) => ({ ...f, signature: strokes.length ? serialize(strokes) : null }));
  }

  const tooBig = Boolean(form.signature && form.signature.length > MAX_SERIALIZED);

  const valid =
    form.name.trim().length >= 2 &&
    Boolean(form.signature) &&
    !tooBig &&
    form.message.trim().length <= LIMITS.message &&
    (form.link.trim() === "" || /^https:\/\/\S{4,180}$/.test(form.link.trim()));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status === "sending") return;

    setStatus("sending");
    const assinou = form.name.trim();

    try {
      await submitSignature(form);

      // A revisão é automática e roda no banco, então o cliente não sabe o
      // veredito. Recarregar a lista e procurar a assinatura responde isso sem
      // inventar: se ela está na leitura pública, foi publicada; se não, ficou
      // retida. O estado público é a fonte de verdade.
      const rows = await fetchSignatures().catch(() => null);
      if (rows) {
        setItems(rows);
        const entrou = rows.some(
          (r) =>
            r.name === assinou &&
            Date.now() - new Date(r.created_at).getTime() < 120_000,
        );
        setStatus(entrou ? "sent" : "held");
      } else {
        setStatus("sent");
      }

      setForm(EMPTY);
      setPadKey((k) => k + 1); // remonta o pad, limpando o canvas
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="assinaturas" className="mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-40">
      <SectionHeading index={guestbook.index} title={t(guestbook.heading)} note={t(guestbook.note)} />

      <div className="mt-14 grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* form */}
        <Reveal>
          <form onSubmit={onSubmit} className="space-y-7">
            <div>
              <span className="label mb-2 block">{t(guestbook.signLabel)}</span>
              <SignaturePad
                key={padKey}
                onChange={onStrokes}
                hint={t(guestbook.signHint)}
                clearLabel={t(guestbook.clear)}
                undoLabel={t(guestbook.undo)}
              />
            </div>

            <Field
              label={t(guestbook.nameLabel)}
              value={form.name}
              onChange={set("name")}
              placeholder={t(guestbook.namePlaceholder)}
              max={LIMITS.name}
              required
            />
            <Field
              label={t(guestbook.relationLabel)}
              value={form.relation}
              onChange={set("relation")}
              placeholder={t(guestbook.relationPlaceholder)}
              max={LIMITS.relation}
            />
            <Field
              label={t(guestbook.messageLabel)}
              value={form.message}
              onChange={set("message")}
              placeholder={t(guestbook.messagePlaceholder)}
              max={LIMITS.message}
              multiline
            />
            <Field
              label={t(guestbook.linkLabel)}
              value={form.link}
              onChange={set("link")}
              placeholder={t(guestbook.linkPlaceholder)}
              max={LIMITS.link}
              type="url"
            />

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              {status === "sent" || status === "held" ? (
                <>
                  <p
                    className={`font-mono text-[13px] ${
                      status === "sent" ? "text-accent" : "text-muted"
                    }`}
                  >
                    {status === "sent" ? t(guestbook.sent) : t(guestbook.held)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="underline-grow font-mono text-[13px] text-muted transition-colors hover:text-accent"
                  >
                    {t(guestbook.sendAnother)}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={!valid || status === "sending"}
                    className="underline-grow font-mono text-sm text-ink transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-faint disabled:hover:text-faint"
                  >
                    {status === "sending" ? t(guestbook.sending) : `${t(guestbook.submit)} →`}
                  </button>
                  {status === "error" && (
                    <p className="font-mono text-[13px] text-accent">{t(guestbook.error)}</p>
                  )}
                  {status === "idle" && !valid && (
                    <p className="label">{t(guestbook.needSignature)}</p>
                  )}
                </>
              )}
            </div>

            <p className="label !text-faint">{t(guestbook.moderated)}</p>
          </form>
        </Reveal>

        {/* signatures */}
        <Reveal delay={120}>
          {loadFailed ? (
            <p className="font-mono text-[13px] text-faint">{t(guestbook.loadError)}</p>
          ) : items.length === 0 ? (
            <p className="font-mono text-[13px] text-faint">{t(guestbook.empty)}</p>
          ) : (
            <ul className="max-h-[34rem] space-y-1 overflow-y-auto pr-2">
              {items.map((s, i) => {
                const strokes = parse(s.signature);
                return (
                  <li key={`${s.created_at}-${i}`} className="rule py-6 first:pt-0">
                    {strokes && (
                      <SignatureView
                        strokes={strokes}
                        animate
                        className="mb-3 h-24 w-full text-ink"
                      />
                    )}
                    {s.message && (
                      <p className="text-[15px] leading-relaxed text-muted">“{s.message}”</p>
                    )}
                    <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {s.link ? (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noreferrer noopener nofollow"
                          className="underline-grow font-mono text-[13px] text-accent"
                        >
                          {s.name}
                        </a>
                      ) : (
                        <span className="font-mono text-[13px] text-accent">{s.name}</span>
                      )}
                      {s.relation && <span className="label">{s.relation}</span>}
                      <span className="label !text-faint ml-auto">
                        {formatDate(s.created_at, lang)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
