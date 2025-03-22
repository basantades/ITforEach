export interface User {
    
    id: string;                 // uuid de supabase
    githubUsername: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    // Campos personalizados
    bio?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
  }