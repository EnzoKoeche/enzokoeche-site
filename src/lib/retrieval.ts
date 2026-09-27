/**
 * Retrieval lexical (BM25) rodando inteiro no navegador.
 *
 * A escolha é deliberada: um modelo de embeddings multilíngue custaria dezenas
 * de MB de download para responder perguntas sobre uma página. BM25 sobre um
 * dossiê curado responde na hora, funciona offline e — o que importa — permite
 * o mesmo contrato dos sistemas RAG que eu construo: resposta com fonte citada
 * ou uma recusa honesta quando não há base recuperada.
 */

export type Chunk = {
  id: string;
  /** texto pesquisável e exibível, por idioma */
  text: { pt: string; en: string };
  /** rótulo da fonte, por idioma */
  source: { pt: string; en: string };
  /** âncora da seção ou URL externa que sustenta o trecho */
  href: string;
};

const STOPWORDS = new Set(
  (
    "a o e é de do da dos das em no na nos nas um uma uns umas para por com sem que quem qual quais como onde quando porque se ao aos à às pelo pela pelos pelas este esta isto esse essa isso aquele aquela aquilo seu sua seus suas meu minha meus minhas dele dela deles delas ele ela eles elas eu tu você vocês nós não sim mais menos muito pouco também já ainda entre sobre até desde ser ter estar foi era são está estão tem têm faz fazem coisa algo " +
    "the a an and or of in on at to for with without from by as is are was were be been has have had do does did not no yes it its he she they them his her their this that these those what which who where when why how i you we me my your our us more most less very much many also just still about"
  )
    .trim()
    .split(/\s+/),
);

/** minúsculas, sem acento, só alfanumérico; plural final simples cai */
export function tokenize(raw: string): string[] {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
}

export type Hit = { chunk: Chunk; score: number };

type Index = {
  chunks: Chunk[];
  docs: string[][];
  df: Map<string, number>;
  avgLen: number;
};

/** O índice cobre os dois idiomas de uma vez: quem está na página em inglês
    pode perguntar em português (e vice-versa) sem cair numa recusa falsa. */
export function buildIndex(chunks: Chunk[]): Index {
  const docs = chunks.map((c) => tokenize(`${c.text.pt} ${c.text.en}`));
  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const term of new Set(doc)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const avgLen = docs.reduce((s, d) => s + d.length, 0) / Math.max(docs.length, 1);
  return { chunks, docs, df, avgLen };
}

const K1 = 1.4;
const B = 0.6;

/**
 * Piso de recuperação: abaixo disso o certo é dizer "não encontrei".
 * Calibrado à mão contra o dossiê — perguntas dentro do escopo passam de 2
 * com folga; assunto fora do dossiê fica perto de zero.
 */
export const MIN_SCORE = 1.5;

export function search(index: Index, query: string, limit = 3): Hit[] {
  const terms = tokenize(query);
  if (!terms.length) return [];

  const n = index.docs.length;
  const distinct = new Set(terms);
  const scores = index.docs.map((doc, i) => {
    const len = doc.length;
    let score = 0;
    let matched = 0;
    for (const term of distinct) {
      const df = index.df.get(term);
      if (!df) continue;
      const tf = doc.filter((t) => t === term).length;
      if (!tf) continue;
      matched += 1;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      score += (idf * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * len) / index.avgLen));
    }
    // Cobertura pune a pergunta que só esbarrou no dossiê por uma palavra:
    // "previsão do tempo" não pode passar porque um projeto é "tempo real".
    return { chunk: index.chunks[i], score: score * (matched / distinct.size) };
  });

  return scores
    .filter((h) => h.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
