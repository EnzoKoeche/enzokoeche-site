import {
  about,
  education,
  experience,
  journey,
  method,
  profile,
  projects,
  stack,
} from "./content";
import type { Chunk } from "./retrieval";

/**
 * O dossiê que o agente local consulta: gerado do próprio conteúdo do site
 * (fica em sincronia sozinho) mais um punhado de fatos escritos à mão que não
 * têm seção própria. Toda resposta aponta para a âncora ou o repositório de
 * onde saiu — o mesmo contrato de citação dos meus sistemas RAG.
 */

const chunks: Chunk[] = [];

/* perfil e sobre */
chunks.push({
  id: "perfil",
  text: {
    pt: `${profile.name}, ${profile.role.pt}, em ${profile.location.pt}. ${profile.tagline.pt} Contato: ${profile.email}.`,
    en: `${profile.name}, ${profile.role.en}, in ${profile.location.en}. ${profile.tagline.en} Contact: ${profile.email}.`,
  },
  source: { pt: "Sobre", en: "About" },
  href: "#sobre",
});

about.body.pt.forEach((pt, i) => {
  chunks.push({
    id: `sobre-${i}`,
    text: { pt, en: about.body.en[i] },
    source: { pt: "Sobre", en: "About" },
    href: "#sobre",
  });
});

journey.steps.forEach((s, i) => {
  chunks.push({
    id: `trajetoria-${i}`,
    text: {
      pt: `${s.year} — ${s.title.pt}. ${s.body.pt}`,
      en: `${s.year} — ${s.title.en}. ${s.body.en}`,
    },
    source: { pt: "Trajetória", en: "Trajectory" },
    href: "#sobre",
  });
});

/* método */
method.principles.forEach((p, i) => {
  chunks.push({
    id: `metodo-${i}`,
    text: {
      pt: `Princípio: ${p.title.pt}. ${p.body.pt} Prova: ${p.proof.pt}.`,
      en: `Principle: ${p.title.en}. ${p.body.en} Proof: ${p.proof.en}.`,
    },
    source: { pt: "Método", en: "Method" },
    href: "#metodo",
  });
});

/* stack */
stack.groups.forEach((g, i) => {
  chunks.push({
    id: `stack-${i}`,
    text: {
      pt: `Stack — ${g.label.pt}: ${g.items.join(", ")}.`,
      en: `Stack — ${g.label.en}: ${g.items.join(", ")}.`,
    },
    source: { pt: "Stack", en: "Stack" },
    href: "#stack",
  });
});

/* projetos */
projects.forEach((p) => {
  chunks.push({
    id: `projeto-${p.slug}`,
    text: {
      pt: `Projeto ${p.name} (${p.year}, ${p.tags.join(", ")}): ${p.blurb.pt} ${p.detail.pt} Destaques: ${p.highlights.pt.join("; ")}.`,
      en: `Project ${p.name} (${p.year}, ${p.tags.join(", ")}): ${p.blurb.en} ${p.detail.en} Highlights: ${p.highlights.en.join("; ")}.`,
    },
    source: { pt: p.name, en: p.name },
    href: p.repo ?? "#projetos",
  });
});

/* currículo */
experience.forEach((e, i) => {
  chunks.push({
    id: `experiencia-${i}`,
    text: {
      pt: `Experiência: ${e.role.pt} na ${e.org.pt} (${e.period.pt}). ${e.bullets.pt.join(" ")}`,
      en: `Experience: ${e.role.en} at ${e.org.en} (${e.period.en}). ${e.bullets.en.join(" ")}`,
    },
    source: { pt: "Currículo", en: "Résumé" },
    href: "#curriculo",
  });
});

education.forEach((e, i) => {
  chunks.push({
    id: `formacao-${i}`,
    text: {
      pt: `Formação: estuda ${e.role.pt} na ${e.org.pt} (${e.period.pt}). ${e.bullets.pt.join(" ")}`,
      en: `Education: studies ${e.role.en} at ${e.org.en} (${e.period.en}). ${e.bullets.en.join(" ")}`,
    },
    source: { pt: "Currículo", en: "Résumé" },
    href: "#curriculo",
  });
});

/* fatos sem seção própria */
chunks.push(
  {
    id: "areas",
    text: {
      pt: "Trabalha com agentes de IA, sistemas RAG, BI e plataformas de dados, backend e produtos web. Hoje trabalha na Lyx Engenharia e na Milkup, e estuda na PUCPR.",
      en: "He works with AI agents, RAG systems, BI and data platforms, backends and web products. He currently works at Lyx Engenharia and Milkup, and studies at PUCPR.",
    },
    source: { pt: "Sobre", en: "About" },
    href: "#sobre",
  },
  {
    id: "contato",
    text: {
      pt: `Para falar com ele: e-mail ${profile.email}, GitHub (EnzoKoeche) ou LinkedIn. Aberto a oportunidades e a projetos freelance — responde rápido a mensagem.`,
      en: `To reach him: email ${profile.email}, GitHub (EnzoKoeche) or LinkedIn. Open to opportunities and freelance work — replies to messages fast.`,
    },
    source: { pt: "Contato", en: "Contact" },
    href: "#contato",
  },
  {
    id: "lyx-frente",
    text: {
      pt: "Na Lyx Engenharia o trabalho é em sistemas internos de engenharia de obras: BI de planejamento e de qualidade de obras, pipelines de ETL em Python, backend em TypeScript com PostgreSQL e agentes de IA dentro do ciclo de desenvolvimento — revisão de código e fila de merge automatizadas. Arquitetura e lógica são o foco; dado de cliente e de obra não sai da empresa.",
      en: "At Lyx Engenharia the work is on internal construction-engineering systems: planning and quality BI for construction sites, Python ETL pipelines, a TypeScript backend on PostgreSQL, and AI agents inside the development cycle — automated code review and merge queue. Architecture and logic are the focus; client and site data never leaves the company.",
    },
    source: { pt: "Currículo · Lyx", en: "Résumé · Lyx" },
    href: "#curriculo",
  },
  {
    id: "claude-fluxo",
    text: {
      pt: "Ferramenta diária: Claude (Claude Code) como par de engenharia — agentes que revisam PR, respeitam janela de deploy e registram o trabalho. A prática de eval-first e de citação obrigatória vem desse uso intenso de LLMs em produção.",
      en: "Daily tool: Claude (Claude Code) as an engineering pair — agents that review PRs, respect deploy windows and log the work. The eval-first and mandatory-citation practice comes from heavy production use of LLMs.",
    },
    source: { pt: "Método", en: "Method" },
    href: "#metodo",
  },
  {
    id: "hobbies",
    text: {
      pt: "Fora do trabalho: jogos (o rastreador Soulstone nasceu da comunidade de TBH: Task Bar Hero, e o FPSBooster da vontade de espremer FPS no Windows) e projetos da faculdade na PUCPR, como o Modular Perfumes — um consultor olfativo com IA.",
      en: "Outside work: games (the Soulstone tracker came from the TBH: Task Bar Hero community, FPSBooster from squeezing FPS out of Windows) and university projects at PUCPR, like Modular Perfumes — an AI fragrance consultant.",
    },
    source: { pt: "Projetos", en: "Work" },
    href: "#projetos",
  },
  {
    id: "este-site",
    text: {
      pt: "Este site é uma prancha de engenharia: Next.js, malha e carimbo com a revisão real do build, telemetria ao vivo do GitHub e este agente local — retrieval BM25 rodando no seu navegador, sem servidor e sem chave de API. Código aberto em github.com/EnzoKoeche/enzokoeche-site.",
      en: "This site is an engineering sheet: Next.js, a grid and a title block carrying the build's real revision, live GitHub telemetry and this local agent — BM25 retrieval running in your browser, no server, no API key. Open source at github.com/EnzoKoeche/enzokoeche-site.",
    },
    source: { pt: "Carimbo", en: "Title block" },
    href: "https://github.com/EnzoKoeche/enzokoeche-site",
  },
);

export const dossier = chunks;
