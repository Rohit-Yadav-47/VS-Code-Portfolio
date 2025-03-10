export interface Experience {
  title: string;
  period: string;
  points: string[];
  isActive?: boolean;
}

export interface Project {
  title: string;
  image: string;
  tech: string[];
  points: string[];
  stars: number;
  forks: number;
  link?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  score: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export interface Research {
  title: string;
  publisher: string;
}
