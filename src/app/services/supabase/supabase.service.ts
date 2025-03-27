import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
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
    return this.supabase.auth.signOut();
  }

  
}