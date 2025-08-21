export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
  website: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  contact: Contact;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}