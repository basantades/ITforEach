import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  // Iniciar sesión con GitHub
  async loginWithGithub() {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: environment.redirectUrl
        }
      });
      if (error) {
        console.error("❌ Error en login:", error);
      } else {
        console.log("✅ Redirigiendo a GitHub...");
      }
    } catch (err) {
      console.error("❌ Error inesperado en login:", err);
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }

  // Obtener la sesión actual
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error("❌ Error obteniendo sesión:", error);
      return null;
    }
    return data.session;
  }

  // Obtener usuario actual
  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return null;
    }
    return data?.user ?? null;
  }

  // Escuchar cambios en el estado de autenticación
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    this.supabase.auth.onAuthStateChange(callback);
  }

  // Cliente de Supabase
  get client(): SupabaseClient {
    return this.supabase;
  }
}