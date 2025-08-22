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

export interface Document {
  id: string;
  name: string;
  type: 'cv' | 'resume' | 'certificate' | 'transcript' | 'portfolio' | 'other';
  filename: string;
  fileSize: number;
  mimeType: string;
  content: string; // Base64 encoded content
  uploadDate: Date;
  description?: string;
  isPublic: boolean;
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  filename: string;
  fileSize: number;
  mimeType: string;
  content: string; // Base64 encoded content
  uploadDate: Date;
  description?: string;
  tags: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  contact: Contact;
  documents: Document[];
  media: MediaFile[];
  resumeId?: string; // Primary resume/CV reference
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}