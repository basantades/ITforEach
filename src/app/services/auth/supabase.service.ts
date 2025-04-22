import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private notification: NotificationService) {
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
        this.notification.showError("Error iniciando sesión con GitHub.");
      } else {
        this.notification.showSuccess("Redirigiendo a GitHub...");
      }
    } catch (err) {
      this.notification.logAndThrow(err, "Error inesperado al iniciar sesión.");
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      this.notification.logAndThrow(error, 'Error al cerrar sesión.');
    }
  }

  // Obtener la sesión actual
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      this.notification.logAndThrow(error, 'Error obteniendo sesión.');
      return null;
    }
    return data.session;
  }

  // Obtener usuario actual
  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      this.notification.logAndThrow(error, 'Error obteniendo el usuario actual.');
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