import { execSync } from "node:child_process";
import type { NextConfig } from "next";

/* Revisão que vai para o carimbo da prancha. Na Vercel o commit vem no env;
   localmente, do git; sem nenhum dos dois, a folha sai como rascunho. */
function rev(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "rascunho";
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_REV: rev(),
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
