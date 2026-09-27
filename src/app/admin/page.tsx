import type { Metadata } from "next";
import AdminClient from "./AdminClient";

// Fora do índice: é uma tela operacional, não conteúdo do portfólio.
export const metadata: Metadata = {
  title: "Moderação",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
