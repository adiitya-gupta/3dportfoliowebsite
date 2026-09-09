export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
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
  category: 'Frontend' | 'Backend' | '3D & Graphics' | 'Tools & DevOps';
  color: string;
  icon: string;
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
}

export interface VehicleStats {
  speedKmh: number;
  nitroLevel: number; // 0 to 100
  isBoosting: boolean;
  currentZone: string;
}

export type CarColor = {
  name: string;
  hex: number;
  css: string;
};
