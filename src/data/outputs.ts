import type { HomeLocale } from "./home";

export type OutputKind = "dataset" | "code" | "other";

export interface ResearchOutput {
  kind: OutputKind;
  title: Record<HomeLocale, string>;
  description: Record<HomeLocale, string>;
  host: string;
  url: string;
  year?: number;
  license?: string;
  doi?: string;
}

// Add records only from the project team's approved outputs catalogue.
// No publication, DOI, license, or repository URL is inferred from the prototype.
export const researchOutputs: ResearchOutput[] = [];
