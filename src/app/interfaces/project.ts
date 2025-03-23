export interface Project {
        id?: number;
        created_at?: string;
        updated_at?: string;
        user_id: string;
        name: string;
        status: 'undefined' | 'in_progress' | 'testing' | 'completed' | 'paused';
      
        description?: string;
        about_project?: string;
        repository_url?: string;
        homepage_url?: string;
        topics?: string[];
        languages?: any; // Puedes tipar esto mejor si defines el formato de languages
        github_updated_at?: string;
        main_image_url?: string;
        extra_images_urls?: string[];
      }
      