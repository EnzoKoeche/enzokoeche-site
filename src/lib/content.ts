/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTEÚDO DO SITE — edite tudo por aqui.
 *
 *  ⚠️  Os blocos marcados com  // ⚠️ CONFERIR  foram preenchidos com o que dava
 *      pra inferir dos seus repositórios e do seu perfil. Revise datas, cargos e
 *      formação antes de divulgar no LinkedIn.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Lang = "pt" | "en";

export type Bi = Record<Lang, string>;

export const profile = {
  name: "Enzo Koeche Castagna",
  handle: "EnzoKoeche",
  email: "koechecastagnaenzo@gmail.com",
  github: "https://github.com/EnzoKoeche",
  linkedin: "https://www.linkedin.com/in/enzo-koeche-castagna-82ab6137b/",
  location: { pt: "Curitiba, PR — Brasil", en: "Curitiba, Brazil" } satisfies Bi,
  role: {
    pt: "Engenheiro de Software · IA Aplicada",
    en: "Software Engineer · Applied AI",
  } satisfies Bi,
  tagline: {
    pt: "Construo sistemas que pensam — agentes de IA, plataformas de dados e produtos web que aguentam produção.",
    en: "I build systems that think — AI agents, data platforms and web products that hold up in production.",
  } satisfies Bi,
  available: {
    pt: "Aberto a oportunidades",
    en: "Open to opportunities",
  } satisfies Bi,
};

/* ── navegação ─────────────────────────────────────────────────────────── */

export const nav: { id: string; label: Bi }[] = [
  { id: "sobre", label: { pt: "Sobre", en: "About" } },
  { id: "stack", label: { pt: "Stack", en: "Stack" } },
  { id: "projetos", label: { pt: "Projetos", en: "Work" } },
  { id: "metodo", label: { pt: "Método", en: "Method" } },
  { id: "perguntar", label: { pt: "Perguntar", en: "Ask" } },
  { id: "curriculo", label: { pt: "Currículo", en: "Résumé" } },
  { id: "assinaturas", label: { pt: "Assinaturas", en: "Guestbook" } },
  { id: "contato", label: { pt: "Contato", en: "Contact" } },
];

/* ── hero ──────────────────────────────────────────────────────────────── */

export const hero = {
  kicker: { pt: "TRANSMISSÃO ABERTA", en: "SIGNAL OPEN" },
  rotating: {
    pt: ["agentes de IA", "sistemas RAG", "plataformas web", "automação de dados", "produtos de ponta a ponta"],
    en: ["AI agents", "RAG systems", "web platforms", "data automation", "end-to-end products"],
  },
  intro: {
    pt: "Eu construo",
    en: "I build",
  } satisfies Bi,
  ctaWork: { pt: "Ver projetos", en: "See the work" },
  ctaContact: { pt: "Falar comigo", en: "Get in touch" },
  scroll: { pt: "role para explorar", en: "scroll to explore" },
};

/* ── console do hero ───────────────────────────────────────────────────── */

/**
 * Telemetria de verdade ou nada: o console lê a atividade pública do GitHub
 * no navegador de quem visita. Se a leitura falhar, ele diz que falhou —
 * inventar estado aqui contradiria a seção Método inteira.
 */
export const console_ = {
  title: { pt: "TELEMETRIA · AO VIVO", en: "TELEMETRY · LIVE" } satisfies Bi,
  boot: {
    pt: [
      "$ ekc --boot",
      "[ok] prancha carregada",
      "[ok] fonte pública — github.com/EnzoKoeche/enzokoeche-site",
      "[··] lendo atividade pública do GitHub…",
    ],
    en: [
      "$ ekc --boot",
      "[ok] sheet loaded",
      "[ok] public source — github.com/EnzoKoeche/enzokoeche-site",
      "[··] reading public GitHub activity…",
    ],
  },
  offline: {
    pt: "[!!] telemetria indisponível agora — sem dado, o console não inventa.",
    en: "[!!] telemetry unavailable right now — no data, and this console doesn't make data up.",
  } satisfies Bi,
  events: {
    push: { pt: "push", en: "push" },
    prOpened: { pt: "PR aberta", en: "PR opened" },
    prMerged: { pt: "PR mergeada", en: "PR merged" },
    created: { pt: "criado", en: "created" },
    issue: { pt: "issue", en: "issue" },
  },
  commits: { pt: "commits", en: "commits" } satisfies Bi,
  commit: { pt: "commit", en: "commit" } satisfies Bi,
  ago: {
    now: { pt: "agora", en: "now" } satisfies Bi,
    m: { pt: "min atrás", en: "min ago" } satisfies Bi,
    h: { pt: "h atrás", en: "h ago" } satisfies Bi,
    d: { pt: "d atrás", en: "d ago" } satisfies Bi,
  },
};

/* ── sobre ─────────────────────────────────────────────────────────────── */

export const about = {
  heading: { pt: "Sobre", en: "About" },
  index: "01",
  body: {
    pt: [
      "Sou desenvolvedor full-stack com foco em IA aplicada. Meu trabalho vive na fronteira entre engenharia de software séria e sistemas que raciocinam: agentes orquestrados com LangGraph, RAG com citação obrigatória, pipelines de dados e produtos web que precisam funcionar de verdade — não só na demo.",
      "Hoje divido o tempo entre a Lyx Engenharia, onde trabalho com engenharia de software e IA aplicada, e a Milkup, com software para a indústria de laticínios: conformidade, qualidade e dados operacionais. Fora dali, mantenho um portfólio público de projetos que existem para provar disciplina de engenharia — evals mensuráveis, testes, controle de custo e latência, segurança de dados sensíveis.",
      "O que me interessa é o ponto onde o sistema para de ser um protótipo bonito e passa a ser confiável.",
    ],
    en: [
      "I'm a full-stack developer focused on applied AI. My work lives at the border between serious software engineering and systems that reason: agents orchestrated with LangGraph, RAG with mandatory citation, data pipelines, and web products that have to actually work — not just demo well.",
      "I currently split my time between Lyx Engenharia, working on software engineering and applied AI, and Milkup, on software for the dairy industry: compliance, quality and operational data. Outside of that, I keep a public portfolio of projects built to prove engineering discipline — measurable evals, tests, cost and latency control, and care with sensitive data.",
      "What interests me is the point where a system stops being a pretty prototype and becomes dependable.",
    ],
  },
  // Números conferíveis: quem abrir o GitHub tem que bater a conta.
  // Ver princípio 04 em `method` — número que ninguém verifica é decoração.
  stats: [
    { value: "12", label: { pt: "repositórios públicos", en: "public repos" } },
    { value: "6", label: { pt: "linguagens em produção", en: "languages shipped" } },
    {
      value: "100%",
      label: {
        pt: "cobertura nas tools do agente de crédito",
        en: "coverage on the credit agent's tools",
      },
    },
  ],
};

/* ── trajetória ────────────────────────────────────────────────────────── */

/**
 * Reconstruída a partir do histórico real dos repositórios — cada marco tem
 * código público correspondente. Se for editar, mantenha essa disciplina:
 * biografia sem lastro é a parte que soa a marketing.
 */
export const journey = {
  label: { pt: "Trajetória", en: "Trajectory" },
  steps: [
    {
      year: "2025",
      title: { pt: "Software que mexe na máquina", en: "Software that touches the machine" },
      body: {
        pt: "Comecei perto do metal: um otimizador de FPS em .NET que faz profiling de hardware e altera o registro do Windows. Aprendi cedo a lição que carrego até hoje — mexer no sistema de alguém sem caminho de volta é como se perde a confiança do usuário. Tudo naquele app é reversível.",
        en: "I started close to the metal: a .NET FPS optimiser that profiles hardware and edits the Windows registry. It taught me early the lesson I still carry — changing someone's system with no way back is how you lose their trust. Everything in that app is reversible.",
      },
    },
    {
      year: "2025",
      title: { pt: "Dados que mudam a cada segundo", en: "Data that changes every second" },
      body: {
        pt: "Arbitragem entre exchanges descentralizadas me forçou a encarar latência, confiabilidade e como apresentar números que nunca param quietos. Foi onde parei de pensar em «funciona na minha máquina» e comecei a pensar em «funciona às três da manhã, sozinho».",
        en: "Arbitrage across decentralised exchanges forced me to confront latency, reliability and how to present numbers that never sit still. That's where I stopped thinking about \"works on my machine\" and started thinking about \"works at three in the morning, unattended\".",
      },
    },
    {
      year: "2025",
      title: { pt: "O primeiro agente — e o primeiro susto", en: "The first agent — and the first scare" },
      body: {
        pt: "Escrevi um agente de pré-análise de crédito em SDK puro da Anthropic. Funcionava. O problema é que ele também funcionava quando estava errado: respondia com a mesma confiança tendo base ou não. Descobri ali que o difícil não é fazer um modelo responder — é fazer ele parar de inventar.",
        en: "I wrote a credit pre-analysis agent on the bare Anthropic SDK. It worked. The problem is it also worked when it was wrong: same confidence with or without grounding. That's where I learned the hard part isn't making a model answer — it's making it stop making things up.",
      },
    },
    {
      year: "2026",
      title: { pt: "Reprojeto com disciplina", en: "A rebuild, with discipline" },
      body: {
        pt: "Refiz aquele agente em LangGraph com estado tipado, checkpointing e interrupção para aprovação humana. Dessa vez com evals rodando no CI: 64 testes verdes, 100% de cobertura nas tools determinísticas, evals pagas a dois centavos de dólar. Deixou de ser demonstração e virou engenharia.",
        en: "I rebuilt that agent in LangGraph with typed state, checkpointing and interrupt-based human approval. This time with evals running in CI: 64 passing tests, 100% coverage on the deterministic tools, paid evals for two cents. It stopped being a demo and became engineering.",
      },
    },
    {
      year: "2026",
      title: { pt: "Fazer a IA citar a fonte", en: "Making the AI cite its source" },
      body: {
        pt: "No RAG de conformidade em laticínios, resposta errada não gera retrabalho — gera multa. Então toda afirmação carrega documento e artigo, com o trecho original exibível, e um teste que reprova o build se a citação sumir. Sem base recuperada, o sistema diz que não encontrou.",
        en: "In the dairy-compliance RAG, a wrong answer doesn't cause rework — it causes a fine. So every claim carries its document and article, with the original passage viewable, and a test that fails the build if the citation disappears. With no retrieved basis, the system says it didn't find one.",
      },
    },
    {
      year: "2026",
      title: { pt: "IA aplicada onde ela ainda não chegou", en: "Applied AI where it hasn't arrived yet" },
      body: {
        pt: "Hoje faço engenharia de software e IA aplicada na Lyx Engenharia — uma construtora, não uma empresa de tecnologia. É onde o problema é mais interessante: sistema que precisa funcionar para quem não tem paciência com software, sobre uma operação que não pode parar.",
        en: "Today I do software engineering and applied AI at Lyx Engenharia — a homebuilder, not a tech company. That's where the problem gets interesting: systems for people with no patience for software, over an operation that cannot stop.",
      },
    },
  ],
};

/* ── método ────────────────────────────────────────────────────────────── */

export const method = {
  heading: { pt: "Como eu trabalho", en: "How I work" },
  index: "04",
  note: {
    pt: "Cinco coisas em que eu insisto. Cada uma tem código público provando que não é discurso.",
    en: "Five things I insist on. Each one has public code proving it isn't just talk.",
  } satisfies Bi,
  principles: [
    {
      title: {
        pt: "Um sistema que não sabe precisa dizer que não sabe",
        en: "A system that doesn't know must say so",
      },
      body: {
        pt: "Alucinação não é bug de modelo, é decisão de arquitetura. Se não houver base recuperada, a resposta certa é «não encontrei» — e isso se garante com teste, não com prompt.",
        en: "Hallucination isn't a model bug, it's an architecture decision. With no retrieved basis, the right answer is \"I didn't find it\" — and that's enforced with a test, not a prompt.",
      },
      proof: { pt: "RAG Conformidade Laticínios", en: "RAG Conformidade Laticínios" },
      slug: "projetos",
    },
    {
      title: {
        pt: "Toda mudança precisa de caminho de volta",
        en: "Every change needs a way back",
      },
      body: {
        pt: "Migration, tweak de registro, deploy: se não dá para desfazer, não está pronto. O usuário não te dá uma segunda chance depois de você quebrar a máquina dele.",
        en: "Migration, registry tweak, deploy: if it can't be undone, it isn't done. Nobody gives you a second chance after you break their machine.",
      },
      proof: { pt: "FPSBooster", en: "FPSBooster" },
      slug: "projetos",
    },
    {
      title: {
        pt: "IA apoia a decisão; quem decide é gente",
        en: "AI supports the decision; a person makes it",
      },
      body: {
        pt: "Em crédito, saúde ou conformidade, automatizar o julgamento é transferir responsabilidade para quem não pode assumi-la. Construo com interrupção explícita para aprovação humana.",
        en: "In credit, health or compliance, automating judgement hands responsibility to something that can't carry it. I build with an explicit interrupt for human approval.",
      },
      proof: { pt: "Agente de Crédito · LangGraph", en: "Credit Agent · LangGraph" },
      slug: "projetos",
    },
    {
      title: {
        pt: "Se não dá para medir, não está pronto",
        en: "If you can't measure it, it isn't done",
      },
      body: {
        pt: "«Pareceu melhor» não é resultado. Evals determinísticas rodando no CI, custo e latência acompanhados, cobertura onde a lógica é crítica. Número que ninguém verifica é decoração.",
        en: "\"Seems better\" is not a result. Deterministic evals in CI, cost and latency tracked, coverage where the logic is critical. A number nobody verifies is decoration.",
      },
      proof: { pt: "64 testes · 6/6 evals · US$ 0,02", en: "64 tests · 6/6 evals · US$0.02" },
      slug: "projetos",
    },
    {
      title: {
        pt: "Dado sensível não entra sem plano",
        en: "Sensitive data doesn't get in without a plan",
      },
      body: {
        pt: "Portfólio meu roda com dado sintético, e PII em produção é tratada explicitamente — não como detalhe que se resolve depois. Vazamento não tem rollback.",
        en: "My portfolio runs on synthetic data, and PII in production is handled explicitly — not as a detail to sort out later. A leak has no rollback.",
      },
      proof: { pt: "Agente Bancário · dados sintéticos", en: "Agente Bancário · synthetic data" },
      slug: "projetos",
    },
  ],
};

/* ── stack ─────────────────────────────────────────────────────────────── */

export const stack = {
  heading: { pt: "Arsenal", en: "Arsenal" },
  index: "02",
  note: {
    pt: "Ferramentas que uso com frequência o bastante para ter opinião sobre elas.",
    en: "Tools I use often enough to have opinions about.",
  } satisfies Bi,
  groups: [
    {
      label: { pt: "Linguagens", en: "Languages" },
      items: ["Python", "TypeScript", "JavaScript", "SQL", "C#", "Dart"],
    },
    {
      label: { pt: "IA & Dados", en: "AI & Data" },
      items: ["LangGraph", "LangChain", "RAG", "Anthropic SDK", "OpenAI SDK", "Pandas", "Power BI"],
    },
    {
      label: { pt: "Web", en: "Web" },
      items: ["Next.js", "React", "Tailwind CSS", "Node.js", "FastAPI", "Streamlit"],
    },
    {
      label: { pt: "Dados & Infra", en: "Data & Infra" },
      items: ["PostgreSQL", "Supabase", "Prisma", "SQLite", "Vercel", "Docker", "GitHub Actions"],
    },
    {
      label: { pt: "Mobile & Desktop", en: "Mobile & Desktop" },
      items: ["Flutter", "Riverpod", "Drift", ".NET 8", "WPF"],
    },
    {
      label: { pt: "Prática", en: "Practice" },
      items: [
        "Eval-first",
        "Human-in-the-loop",
        "CI/CD",
        "Testes automatizados",
        "Observabilidade",
      ],
    },
  ],
};

/* ── projetos ──────────────────────────────────────────────────────────── */

export type Project = {
  slug: string;
  name: string;
  year: string;
  tags: string[];
  featured?: boolean;
  repo?: string;
  demo?: string;
  demoLabel?: Bi;
  /** plate shown on hover, drawn for what this project actually does */
  image?: string;
  blurb: Bi;
  detail: Bi;
  highlights: { pt: string[]; en: string[] };
};

/**
 * Instrument plates that drift behind the whole page and show on project hover.
 * Generated vector art — regenerate with `python3 scripts/gen-plates.py`.
 */
export const plates = [
  "/plates/retrieval.svg",
  "/plates/flow.svg",
  "/plates/series.svg",
  "/plates/mesh.svg",
  "/plates/tree.svg",
  "/plates/spread.svg",
  "/plates/contours.svg",
  "/plates/gauges.svg",
  "/plates/ledger.svg",
];

export const projects: Project[] = [
  {
    slug: "rag-conformidade-laticinios",
    image: "/plates/retrieval.svg",
    name: "RAG Conformidade Laticínios",
    year: "2026",
    tags: ["Python", "LangGraph", "RAG", "Streamlit"],
    featured: true,
    repo: "https://github.com/EnzoKoeche/rag-conformidade-laticinios",
    demo: "https://rag-conformidade.streamlit.app",
    demoLabel: { pt: "Demo ao vivo", en: "Live demo" },
    blurb: {
      pt: "RAG agêntico que responde sobre conformidade em laticínios citando a fonte oficial — ou admitindo que não sabe.",
      en: "Agentic RAG answering dairy-compliance questions with a cited official source — or an honest 'I don't know'.",
    },
    detail: {
      pt: "Responde perguntas sobre conformidade e qualidade na indústria de laticínios usando exclusivamente documentos públicos oficiais (IN 76 e 77 do MAPA, RIISPOA, manuais da Embrapa). Toda afirmação carrega documento e artigo, com o trecho original exibível. Sem base recuperada, o sistema diz que não encontrou em vez de inventar.",
      en: "Answers dairy-industry compliance and quality questions using only official public documents (Brazil's MAPA IN 76/77, RIISPOA, Embrapa manuals). Every claim carries its document and article, with the original passage viewable. With no retrieved basis, the system says it didn't find one instead of hallucinating.",
    },
    highlights: {
      pt: [
        "Corrective RAG orquestrado em LangGraph",
        "Retrieval híbrido + rerank local",
        "Citação obrigatória verificada por teste",
        "Modo demo com custo zero",
      ],
      en: [
        "Corrective RAG orchestrated in LangGraph",
        "Hybrid retrieval + local rerank",
        "Mandatory citation verified by tests",
        "Zero-cost demo mode",
      ],
    },
  },
  {
    slug: "agente-credito-langgraph",
    image: "/plates/flow.svg",
    name: "Agente de Crédito · LangGraph",
    year: "2026",
    tags: ["Python", "LangGraph", "HITL", "Evals"],
    featured: true,
    repo: "https://github.com/EnzoKoeche/agente-credito-langgraph",
    demo: "https://agente-credito-langgraph.streamlit.app",
    demoLabel: { pt: "Demo ao vivo", en: "Live demo" },
    blurb: {
      pt: "Agente de apoio à análise de crédito PF com estado tipado, human-in-the-loop e evals que rodam no CI.",
      en: "Consumer-credit analysis agent with typed state, human-in-the-loop and evals that run in CI.",
    },
    detail: {
      pt: "Reprojeto do agente-bancario com foco em LangGraph em nível avançado: estado tipado, arestas condicionais, interrupção para aprovação humana, checkpointing, streaming e observabilidade — mantendo evals mensuráveis, testes e segurança de PII. Dados sintéticos; o agente apoia a decisão, nunca decide sozinho.",
      en: "A redesign of agente-bancario focused on advanced LangGraph: typed state, conditional edges, interrupt-based human approval, checkpointing, streaming and observability — while keeping measurable evals, tests and PII safety. Synthetic data; the agent supports the decision, never makes it alone.",
    },
    highlights: {
      pt: [
        "64 testes verdes, 100% nas tools determinísticas",
        "Evals pagas 6/6 PASS a ~US$ 0,02",
        "Checkpointing e retomada de conversa",
        "PII tratada explicitamente",
      ],
      en: [
        "64 passing tests, 100% on deterministic tools",
        "Paid evals 6/6 PASS at ~US$0.02",
        "Checkpointing and conversation resume",
        "PII handled explicitly",
      ],
    },
  },
  {
    slug: "soulstone",
    image: "/plates/series.svg",
    name: "Soulstone",
    year: "2026",
    tags: ["React", "TypeScript", "Supabase", "Vercel"],
    featured: true,
    repo: "https://github.com/EnzoKoeche/soulstone",
    demo: "https://soulstone-sooty.vercel.app/",
    demoLabel: { pt: "Demo ao vivo", en: "Live demo" },
    blurb: {
      pt: "Rastreador de preços do Steam Market em tempo real para a comunidade de TBH: Task Bar Hero.",
      en: "Real-time Steam Market price tracker for the TBH: Task Bar Hero community.",
    },
    detail: {
      pt: "App companion que acompanha preços do Steam Market, histórico e variação para os itens do jogo. Usa apenas dados públicos de mercado e nunca toca no jogo. CI verde, licença MIT e demo pública — feito para a comunidade usar, não só para o portfólio.",
      en: "A companion app tracking Steam Market prices, history and variation for the game's items. Uses public market data only and never touches the game. Green CI, MIT licence and a public demo — built for the community to actually use.",
    },
    highlights: {
      pt: [
        "Dados de mercado em tempo real via Supabase",
        "CI no GitHub Actions",
        "Open source sob MIT",
        "Em uso por jogadores reais",
      ],
      en: [
        "Real-time market data through Supabase",
        "CI on GitHub Actions",
        "Open source under MIT",
        "Used by real players",
      ],
    },
  },
  {
    slug: "shadowmesh",
    image: "/plates/mesh.svg",
    name: "ShadowMesh",
    year: "2026",
    tags: ["Python", "Segurança", "IA", "Governança"],
    repo: "https://github.com/EnzoKoeche/shadowmesh",
    blurb: {
      pt: "Control plane de segurança para IA: descobre, classifica e governa o uso de ferramentas de IA numa organização.",
      en: "An AI security control plane: discovers, classifies and governs AI tool usage across an organisation.",
    },
    detail: {
      pt: "Plataforma de descoberta e governança de Shadow AI. Intercepta o tráfego de ferramentas de IA, classifica o que está sendo usado e aplica políticas — o problema de quem precisa liberar IA no time sem perder o controle sobre dado sensível.",
      en: "A Shadow AI discovery and governance platform. It intercepts AI tool traffic, classifies what's being used and enforces policy — the problem faced by anyone enabling AI for a team without losing control of sensitive data.",
    },
    highlights: {
      pt: ["Interceptação e classificação de tráfego", "Motor de políticas", "Foco em contexto enterprise"],
      en: ["Traffic interception and classification", "Policy engine", "Enterprise-oriented"],
    },
  },
  {
    slug: "orkestree",
    image: "/plates/tree.svg",
    name: "Orkestree",
    year: "2026",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    repo: "https://github.com/EnzoKoeche/Orkestree",
    demo: "https://orkestree-web.vercel.app",
    demoLabel: { pt: "Ver produto", en: "See product" },
    blurb: {
      pt: "Plataforma web com documentação técnica versionada junto ao código e cérebro externo no Notion.",
      en: "Web platform with technical docs versioned alongside the code and an external brain in Notion.",
    },
    detail: {
      pt: "Produto Next.js com Postgres e Prisma, construído sobre um sistema de conhecimento dual: documentação versionada que vive com o código, complementada por um cérebro externo no Notion. Cada camada com responsabilidade clara sobre o que documenta.",
      en: "A Next.js product on Postgres and Prisma, built on a dual knowledge system: versioned documentation living next to the code, complemented by an external brain in Notion. Each layer with a clear responsibility.",
    },
    highlights: {
      pt: ["Next.js + Prisma + Postgres", "Deploy contínuo na Vercel", "Documentação como parte do repositório"],
      en: ["Next.js + Prisma + Postgres", "Continuous deploy on Vercel", "Documentation as part of the repo"],
    },
  },
  {
    slug: "rocketzarb",
    image: "/plates/spread.svg",
    name: "RocketzArb",
    year: "2025",
    tags: ["TypeScript", "Web3", "DeFi", "Next.js"],
    repo: "https://github.com/EnzoKoeche/RocketzArb",
    blurb: {
      pt: "Aplicação de arbitragem automatizada entre exchanges descentralizadas, com monitoramento em tempo real.",
      en: "Automated arbitrage across decentralised exchanges, with real-time monitoring.",
    },
    detail: {
      pt: "Plataforma que detecta e executa oportunidades de arbitragem entre DEXs, com dashboard de operações e lucro em tempo real. Exercício pesado de latência, confiabilidade e apresentação de dados que mudam a cada segundo.",
      en: "A platform that detects and executes arbitrage opportunities across DEXs, with a real-time operations and profit dashboard. A heavy exercise in latency, reliability and presenting data that changes every second.",
    },
    highlights: {
      pt: ["Detecção automática de oportunidades", "Dashboard em tempo real", "Múltiplas DEXs"],
      en: ["Automatic opportunity detection", "Real-time dashboard", "Multiple DEXs"],
    },
  },
  {
    slug: "auriculo",
    image: "/plates/contours.svg",
    name: "Auriculo",
    year: "2026",
    tags: ["Flutter", "Dart", "Offline-first", "SQLite"],
    blurb: {
      pt: "App de referência em auriculoterapia para profissionais de saúde — 100% offline, educacional por design.",
      en: "An auriculotherapy reference app for health professionals — fully offline, educational by design.",
    },
    detail: {
      pt: "App Flutter offline-first com Drift/SQLite como fonte primária de leitura, Riverpod para estado e go_router para navegação. Escopo deliberadamente educacional: não diagnostica nem prescreve, e essa fronteira é parte do produto.",
      en: "An offline-first Flutter app with Drift/SQLite as the primary read source, Riverpod for state and go_router for navigation. Deliberately educational in scope: it neither diagnoses nor prescribes, and that boundary is part of the product.",
    },
    highlights: {
      pt: ["Leitura 100% sem internet", "Material 3 com tema claro/escuro", "Android e iOS na mesma base"],
      en: ["Reading works fully offline", "Material 3 with light/dark themes", "Android and iOS from one codebase"],
    },
  },
  {
    slug: "fpsbooster",
    image: "/plates/gauges.svg",
    name: "FPSBooster",
    year: "2025",
    tags: ["C#", ".NET 8", "Windows"],
    repo: "https://github.com/EnzoKoeche/fpsbooster",
    blurb: {
      pt: "Otimizador de FPS e latência para Windows: detecta o hardware, sugere tweaks e aplica de forma reversível.",
      en: "FPS and latency optimiser for Windows: detects hardware, suggests tweaks and applies them reversibly.",
    },
    detail: {
      pt: "Aplicação desktop em .NET 8 que faz profiling do hardware, recomenda ajustes específicos para aquela máquina e — o detalhe que importa — mantém tudo reversível. Mexer no registro do Windows sem caminho de volta é como se perde a confiança do usuário.",
      en: "A .NET 8 desktop app that profiles the hardware, recommends machine-specific tweaks and — the part that matters — keeps everything reversible. Touching the Windows registry with no way back is how you lose a user's trust.",
    },
    highlights: {
      pt: ["Detecção de hardware", "Tweaks reversíveis", "Windows 10 e 11"],
      en: ["Hardware detection", "Reversible tweaks", "Windows 10 and 11"],
    },
  },
  {
    slug: "agente-bancario",
    image: "/plates/ledger.svg",
    name: "Agente Bancário",
    year: "2025",
    tags: ["Python", "Anthropic SDK", "Human-in-the-loop"],
    repo: "https://github.com/EnzoKoeche/agente-bancario",
    blurb: {
      pt: "Pré-análise de crédito com extração validada por schema e indicadores determinísticos — o antecessor do agente LangGraph.",
      en: "Credit pre-analysis with schema-validated extraction and deterministic indicators — the LangGraph agent's ancestor.",
    },
    detail: {
      pt: "Agente assistivo em Python e SDK da Anthropic puro: extração validada por schema, indicadores determinísticos, detecção de inconsistências e rascunho com fontes citadas, sempre com humano no circuito. Dados sintéticos, feito para portfólio.",
      en: "An assistive agent in Python on the bare Anthropic SDK: schema-validated extraction, deterministic indicators, inconsistency detection and a drafted answer with cited sources, always with a human in the loop. Synthetic data, built for portfolio.",
    },
    highlights: {
      pt: ["Extração validada por schema", "Indicadores determinísticos", "Fontes sempre citadas"],
      en: ["Schema-validated extraction", "Deterministic indicators", "Sources always cited"],
    },
  },
];

export const work = {
  heading: { pt: "Projetos", en: "Selected work" },
  index: "03",
  note: {
    pt: "Tudo aberto no GitHub. Os que têm demo, você consegue usar agora.",
    en: "All open on GitHub. The ones with a demo, you can use right now.",
  } satisfies Bi,
  repoLabel: { pt: "Código", en: "Code" },
  moreLabel: { pt: "Ver todos os repositórios", en: "Browse all repositories" },
};

/* ── perguntar (agente local) ──────────────────────────────────────────── */

export const ask = {
  heading: { pt: "Pergunte ao sistema", en: "Ask the system" },
  index: "05",
  note: {
    pt: "Um agente de retrieval rodando inteiro no seu navegador — sem servidor, sem chave, sem a pergunta sair da página. Toda resposta cita a fonte; sem base recuperada, ele diz que não encontrou. É o princípio 01 em funcionamento, nesta página.",
    en: "A retrieval agent running entirely in your browser — no server, no key, your question never leaves the page. Every answer cites its source; with no retrieved basis, it says it didn't find one. Principle 01, running on this very page.",
  } satisfies Bi,
  placeholder: {
    pt: "pergunte algo sobre mim…",
    en: "ask something about me…",
  } satisfies Bi,
  suggestionsLabel: { pt: "Sugestões", en: "Try" } satisfies Bi,
  suggestions: {
    pt: [
      "O que ele faz na Lyx?",
      "Como ele evita alucinação?",
      "Quais projetos têm evals?",
      "Qual é a stack dele?",
      "O que ele faz fora do trabalho?",
    ],
    en: [
      "What does he do at Lyx?",
      "How does he prevent hallucination?",
      "Which projects have evals?",
      "What's his stack?",
      "What does he do outside work?",
    ],
  },
  sourceLabel: { pt: "fonte", en: "source" } satisfies Bi,
  relatedLabel: { pt: "relacionado", en: "related" } satisfies Bi,
  scoreLabel: { pt: "score", en: "score" } satisfies Bi,
  notFound: {
    pt: "não encontrei isso no dossiê — e prefiro dizer isso a inventar. Pergunta sobre trabalho, projetos, método ou stack.",
    en: "I didn't find that in the dossier — and I'd rather say so than make something up. Ask about work, projects, method or stack.",
  } satisfies Bi,
  how: {
    pt: "como funciona: BM25 sobre um dossiê versionado no repositório, executado no seu navegador. Recuperação abaixo do piso vira recusa, não resposta.",
    en: "how it works: BM25 over a dossier versioned in the repo, executed in your browser. Retrieval below the floor becomes a refusal, not an answer.",
  } satisfies Bi,
};

/* ── currículo ─────────────────────────────────────────────────────────── */

export type TimelineItem = {
  period: Bi;
  role: Bi;
  org: Bi;
  bullets: { pt: string[]; en: string[] };
};

// ⚠️ CONFERIR: só as descrições da Milkup e do freela seguem sendo palpite meu —
// a Lyx e a formação já foram confirmadas pelo Enzo.
export const experience: TimelineItem[] = [
  {
    period: { pt: "Ago 2026 — atual", en: "Aug 2026 — present" },
    role: { pt: "Software Engineer · IA Aplicada", en: "Software Engineer · Applied AI" },
    org: { pt: "Lyx Engenharia", en: "Lyx Engenharia" },
    bullets: {
      // ⚠️ CONFERIR: trocar por sistemas/stack reais assim que você estiver dentro.
      pt: [
        "Engenharia de software e IA aplicada na maior construtora do programa Minha Casa Minha Vida do Sul do país.",
      ],
      en: [
        "Software engineering and applied AI at the largest homebuilder in Brazil's federal affordable-housing programme in the south of the country.",
      ],
    },
  },
  {
    period: { pt: "Atual", en: "Present" },
    role: { pt: "Desenvolvedor de Software", en: "Software Developer" },
    org: { pt: "Milkup", en: "Milkup" },
    bullets: {
      pt: [
        "Software para a indústria de laticínios: conformidade, qualidade e dados operacionais.",
        "Desenvolvimento full-stack em TypeScript/Next.js com PostgreSQL.",
        "Relatórios e indicadores operacionais em Power BI.",
      ],
      en: [
        "Software for the dairy industry: compliance, quality and operational data.",
        "Full-stack development in TypeScript/Next.js with PostgreSQL.",
        "Operational reporting and indicators in Power BI.",
      ],
    },
  },
  {
    period: { pt: "Atual", en: "Present" },
    role: { pt: "Desenvolvedor Freelancer", en: "Freelance Developer" },
    org: { pt: "Independente", en: "Independent" },
    bullets: {
      pt: [
        "Sites e sistemas sob medida para pequenos negócios em Curitiba.",
        "Do primeiro contato ao deploy: escopo, build, publicação e manutenção.",
      ],
      en: [
        "Custom sites and systems for small businesses in Curitiba.",
        "From first contact to deploy: scoping, building, shipping and maintenance.",
      ],
    },
  },
];

export const education: TimelineItem[] = [
  {
    period: { pt: "3º período · cursando", en: "3rd semester · in progress" },
    role: { pt: "Engenharia de Software", en: "Software Engineering" },
    org: {
      pt: "PUCPR — Pontifícia Universidade Católica do Paraná",
      en: "PUCPR — Pontifical Catholic University of Paraná",
    },
    bullets: {
      pt: [
        "Graduação cursada em paralelo à atuação profissional em engenharia de software e IA aplicada.",
        "O portfólio público ao lado foi construído durante o curso, não depois dele.",
      ],
      en: [
        "Degree taken in parallel with professional work in software engineering and applied AI.",
        "The public portfolio alongside this was built during the course, not after it.",
      ],
    },
  },
];

export const resume = {
  heading: { pt: "Currículo", en: "Résumé" },
  index: "06",
  experienceLabel: { pt: "Experiência", en: "Experience" },
  educationLabel: { pt: "Formação", en: "Education" },
  download: { pt: "Baixar CV (PDF)", en: "Download CV (PDF)" },
  print: { pt: "Imprimir esta página", en: "Print this page" },
};

/* ── assinaturas ───────────────────────────────────────────────────────── */

export const guestbook = {
  heading: { pt: "Assinaturas", en: "Guestbook" },
  index: "07",
  note: {
    pt: "Trabalhou comigo, estudou comigo ou só passou por aqui? Assina aí — de próprio punho.",
    en: "Worked with me, studied with me, or just passing through? Sign it — in your own hand.",
  } satisfies Bi,
  needSignature: {
    pt: "Precisa de um nome e de uma assinatura desenhada.",
    en: "Needs a name and a drawn signature.",
  } satisfies Bi,
  nameLabel: { pt: "Nome", en: "Name" },
  namePlaceholder: { pt: "Como você quer aparecer", en: "How you want to appear" },
  relationLabel: { pt: "De onde a gente se conhece", en: "How we know each other" },
  relationPlaceholder: { pt: "Lyx · time de engenharia", en: "Lyx · engineering team" },
  signLabel: { pt: "Sua assinatura", en: "Your signature" },
  signHint: {
    pt: "assine aqui — com o mouse ou o dedo",
    en: "sign here — mouse or finger",
  } satisfies Bi,
  clear: { pt: "Limpar", en: "Clear" },
  undo: { pt: "Desfazer", en: "Undo" },
  messageLabel: { pt: "Recado (opcional)", en: "Note (optional)" },
  messagePlaceholder: { pt: "Escreve alguma coisa boa aí", en: "Say something good" },
  linkLabel: { pt: "Seu link (opcional)", en: "Your link (optional)" },
  linkPlaceholder: { pt: "https://linkedin.com/in/...", en: "https://linkedin.com/in/..." },
  submit: { pt: "Assinar", en: "Sign" },
  sending: { pt: "Enviando…", en: "Sending…" },
  sent: {
    pt: "Pronto — sua assinatura entrou no livro.",
    en: "Done — your signature is in the book.",
  } satisfies Bi,
  held: {
    pt: "Assinatura recebida, mas o filtro a segurou para revisão manual.",
    en: "Signature received, but the filter held it for manual review.",
  } satisfies Bi,
  sendAnother: { pt: "Assinar de novo", en: "Sign again" },
  error: {
    pt: "Não consegui enviar. Confere os campos e tenta de novo.",
    en: "Couldn't send that. Check the fields and try again.",
  } satisfies Bi,
  loadError: {
    pt: "Não deu para carregar as assinaturas agora.",
    en: "Couldn't load the signatures right now.",
  } satisfies Bi,
  empty: {
    pt: "Ainda não tem ninguém aqui. Seja o primeiro.",
    en: "Nobody here yet. Be the first.",
  } satisfies Bi,
  moderated: {
    pt: "Aparece na hora. Conteúdo ofensivo ou spam fica retido para revisão.",
    en: "Appears immediately. Offensive content or spam is held for review.",
  } satisfies Bi,
};

/* ── contato ───────────────────────────────────────────────────────────── */

export const contact = {
  heading: { pt: "Contato", en: "Contact" },
  index: "08",
  title: {
    pt: "Tem um problema difícil?",
    en: "Got a hard problem?",
  } satisfies Bi,
  body: {
    pt: "Estou aberto a oportunidades e a projetos freelance. Me manda uma mensagem — respondo rápido.",
    en: "I'm open to opportunities and freelance work. Drop me a message — I reply fast.",
  } satisfies Bi,
  emailLabel: { pt: "Mandar e-mail", en: "Send an email" },
  copy: { pt: "copiar", en: "copy" } satisfies Bi,
  copied: { pt: "copiado", en: "copied" },
};

/* ── carimbo ───────────────────────────────────────────────────────────── */

/** Quadro de título da prancha — o rodapé do site como carimbo de projeto. */
export const carimbo = {
  projeto: { pt: "Projeto", en: "Project" } satisfies Bi,
  projetoValue: {
    pt: "Portfólio — Enzo Koeche Castagna",
    en: "Portfolio — Enzo Koeche Castagna",
  } satisfies Bi,
  conteudo: { pt: "Conteúdo", en: "Contents" } satisfies Bi,
  conteudoValue: {
    pt: "Engenharia de software · IA aplicada",
    en: "Software engineering · applied AI",
  } satisfies Bi,
  local: { pt: "Local", en: "Location" } satisfies Bi,
  localValue: "Curitiba/PR · 25°26′S 49°16′W",
  data: { pt: "Data", en: "Date" } satisfies Bi,
  escala: { pt: "Escala", en: "Scale" } satisfies Bi,
  escalaValue: "1:1",
  rev: { pt: "Rev.", en: "Rev." } satisfies Bi,
  folha: { pt: "Folha", en: "Sheet" } satisfies Bi,
};

export const footer = {
  built: {
    pt: "Feito com Next.js, canvas e cafeína. Sem templates.",
    en: "Built with Next.js, canvas and caffeine. No templates.",
  } satisfies Bi,
  rights: { pt: "Todos os direitos reservados.", en: "All rights reserved." },
};

export const ui = {
  langToggle: { pt: "EN", en: "PT" },
  langAria: { pt: "Switch to English", en: "Mudar para português" },
  menu: { pt: "Menu", en: "Menu" },
  close: { pt: "Fechar", en: "Close" },
};
