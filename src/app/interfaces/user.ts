

  export interface User {
    user_id: string;  // ✅ Ahora usa "user_id"
    githubusername: string;
    fullname: string;
    avatarurl: string;
    email?: string | null;
    bio?: string | null;
    sociallinks?: string[] | null;
    website?: string | null;
    links?: string[] | null;
  }
  