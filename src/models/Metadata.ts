export interface Stem {
  description: string;
  file: string;
}

export interface Metadata {
  name: string;
  description: string;
  file: string;
  genre: string;
  bpm: number;
  format: string;
  duration: number;
  license: string;
  stems: Stem[];
}
