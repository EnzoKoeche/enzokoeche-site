import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk, Unbounded } from "next/font/google";
import "./globals.css";
import BlueprintSheet from "@/components/BlueprintSheet";
import { LangProvider } from "@/components/LangProvider";
import MouseGlow from "@/components/MouseGlow";
import PlateDrift from "@/components/PlateDrift";
import Header from "@/components/Header";
import { profile } from "@/lib/content";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/* só para nome e títulos de seção — presença, não texto corrido */
const brand = Unbounded({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const description =
  "Portfólio de Enzo Koeche Castagna — engenheiro de software focado em IA aplicada: agentes com LangGraph, sistemas RAG, plataformas web em Next.js e automação de dados.";

export const metadata: Metadata = {
  metadataBase: new URL("https://enzokoeche.vercel.app"),
  title: {
    default: `${profile.name} — ${profile.role.pt}`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "Enzo Koeche Castagna",
    "engenheiro de software",
    "desenvolvedor full-stack",
    "IA aplicada",
    "LangGraph",
    "RAG",
    "Next.js",
    "Python",
    "TypeScript",
    "Curitiba",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    title: `${profile.name} — ${profile.role.pt}`,
    description,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role.pt}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#061021",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role.en,
  email: `mailto:${profile.email}`,
  url: "https://enzokoeche.vercel.app",
  sameAs: [profile.github, profile.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Curitiba", addressCountry: "BR" },
  knowsAbout: ["Python", "TypeScript", "Next.js", "LangGraph", "PostgreSQL", "Retrieval-Augmented Generation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${display.variable} ${mono.variable} ${brand.variable} antialiased`}>
        {/* Runs during parse, before first paint: opts the page into the
            hidden-then-reveal behaviour only when JS is actually running. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('reveal-ready')`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlueprintSheet />
        <PlateDrift />
        <MouseGlow />
        <LangProvider>
          <Header />
          <main>{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
