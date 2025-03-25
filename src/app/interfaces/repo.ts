export interface Repo {
    name: string;
    description?: string;
    repository_url: string;
    homepage_url?: string;
    topics?: string[];
    languages?: Record<string, number>;
    github_updated_at: string;
    collaborators?: string[]; 
    
    // 🔥 Solo para filtrar qué repos puede publicar el usuario
    permissions: {
      admin: boolean;
      maintain: boolean;
      push: boolean;
      triage: boolean;
      pull: boolean;
    };
  }
  