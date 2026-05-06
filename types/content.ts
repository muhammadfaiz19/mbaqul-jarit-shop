export interface HeroContent {
  headline: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
  quote: string;
  values: { title: string; description: string }[];
  target: string;
}
