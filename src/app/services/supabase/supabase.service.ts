import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router'; // Importar Router


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  user = signal<User | null>(null); // Nuevo signal para almacenar el usuario

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.loadUser(); // Cargar usuario al inicio
    this.listenToAuthChanges(); // Escuchar cambios de sesión
  }

  private async loadUser() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error("❌ Error obteniendo sesión:", error);
      return;
    }
    if (data.session) {
      this.setUserFromSession(data.session);
    }
  }

  private listenToAuthChanges() {
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        this.setUserFromSession(session);
      } else if (event === "SIGNED_OUT") {
        this.user.set(null);
      }
    });
  }

  private setUserFromSession(session: Session | null) {
    if (!session) {
      this.user.set(null);
      return;
    }
    const userMetadata = session.user.user_metadata;
    this.user.set({
      user_id: session.user.id,
      githubusername: userMetadata["user_name"],
      fullname: userMetadata["full_name"],
      avatarurl: userMetadata["avatar_url"],
      email: session.user.email ?? ''
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  signInWithGithub() {
    return this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: environment.redirectUrl
      }
    });
  }
  
  async loginWithGithub() {
    try {
      const { error } = await this.signInWithGithub();
      if (error) {
        console.error("❌ Error en login:", error);
      } else {
        console.log("✅ Redirigiendo a GitHub...");
      }
    } catch (err) {
      console.error("❌ Error inesperado en login:", err);
    }
  }
  

  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return null;
    }
    return data?.user ?? null;
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  logout() {
    return this.supabase.auth.signOut().then(() => {
      this.router.navigate(['/']); // Redirigir a la página de inicio
    }).catch((error) => {
      console.error('❌ Error al cerrar sesión:', error);
    });
  }
}

