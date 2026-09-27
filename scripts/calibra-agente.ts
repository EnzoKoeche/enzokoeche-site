/**
 * Eval do agente local: perguntas dentro do escopo têm que recuperar o chunk
 * esperado; perguntas fora do escopo têm que virar recusa. Sai com código 1
 * em qualquer regressão — rodar com `npm run eval:agente`.
 */
import { dossier } from "../src/lib/dossier";
import { buildIndex, search } from "../src/lib/retrieval";

const idx = buildIndex(dossier);

/** pergunta → prefixo do chunk que deve vencer */
const inScope: [string, string][] = [
  ["O que ele faz na Lyx?", "areas"],
  ["Como ele evita alucinação?", "metodo-0"],
  ["Quais projetos têm evals?", "projeto-agente-credito-langgraph"],
  ["Qual é a stack dele?", "stack-"],
  ["O que ele faz fora do trabalho?", "hobbies"],
  ["onde ele estuda", "areas"],
  ["ele trabalha com RAG?", "areas"],
  ["quem é enzo", "perfil"],
  ["como falar com ele", "contato"],
  ["ele usa claude?", "claude-fluxo"],
  ["o que é soulstone", "hobbies"],
  ["what does he do at lyx", "areas"],
  ["how does he prevent hallucination", "metodo-0"],
];

const outScope = [
  "qual a previsão do tempo amanhã?",
  "receita de bolo de cenoura",
  "quanto custa um iphone",
  "quem ganhou a copa do mundo",
  "qual o salário dele?",
  "best pizza in town",
];

let failures = 0;

for (const [q, expected] of inScope) {
  const hits = search(idx, q);
  const got = hits[0]?.chunk.id ?? "RECUSA";
  const ok = got.startsWith(expected);
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${(hits[0]?.score ?? 0).toFixed(2).padStart(5)}  ${got.padEnd(36)} | ${q}`);
}

for (const q of outScope) {
  const hits = search(idx, q);
  const ok = hits.length === 0;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${ok ? "  —  " : hits[0].score.toFixed(2).padStart(5)}  ${"RECUSA".padEnd(36)} | ${q}`);
}

console.log(failures ? `\n${failures} regressão(ões)` : `\n${inScope.length + outScope.length}/${inScope.length + outScope.length} PASS`);
process.exit(failures ? 1 : 0);
