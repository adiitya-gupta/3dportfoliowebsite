export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  problem: string;
  solution: string;
  contribution: string;
  techStack: string[];
  color: string;
  accentColor: string;
  demoUrl: string;
  githubUrl: string;
  highlights: string[];
  stats?: { label: string; value: string }[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Backend & ML' | 'Data Science & AI' | 'Cloud & DB' | 'Frontend & Tools';
  color: string;
  icon: string;
  experienceDuration: string; // e.g. "2+ Years Experience", "10+ Projects Built"
  level: number;
}

export interface Milestone {
  id: string;
  year: string;
  role: string;
  organization: string;
  description: string;
  skills: string[];
}

export interface TeleportTarget {
  id: string;
  label: string;
  iconName: string;
  position: [number, number, number];
  rotationY: number;
}

export interface VehicleControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  boost: boolean;
  jump?: boolean;
  interact?: boolean;
}

export interface VehicleStats {
  speedKmh: number;
  nitroLevel: number;
  isBoosting: boolean;
  currentZone: string;
}

export type CarColor = {
  name: string;
  hex: number;
  css: string;
};

export type EnvironmentTheme = 'night' | 'day';

export interface PortfolioInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  education: string;
  school: string;
  resumeUrl: string;
}
