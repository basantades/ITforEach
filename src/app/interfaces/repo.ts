export interface Repo {
    name: string;
    description?: string;
    html_url: string;
    homepage?: string;
    topics?: string[];
    languages?: Record<string, number>;
    updated_at: string;

    // 🔥 Solo para filtrar qué repos puede publicar el usuario
    permissions: {
      admin: boolean;
      maintain: boolean;
      push: boolean;
      triage: boolean;
      pull: boolean;
    };
  }
  