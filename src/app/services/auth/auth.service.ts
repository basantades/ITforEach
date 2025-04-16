import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '../../interfaces/user';
import { Session } from '@supabase/supabase-js';
import { UserService } from '../database/user.service'; // Importar UserService

import { Router } from '@angular/router'; // Importar Router


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSignal = signal<User | null>(null); // Usuario autenticado
  isOwnerSignal = signal(false); // Indica si el usuario autenticado es el propietario
  private session: Session | null = null; // Sesión actual

  constructor(private supabaseService: SupabaseService, private userService: UserService, private router: Router) { 
    this.initializeAuthState();
  }

  // Inicializar el estado de autenticación
  private async initializeAuthState() {
    this.session = await this.supabaseService.getSession();
    if (this.session) {
      this.setUserFromSession(this.session);
    }
    this.supabaseService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.session = session;
        this.setUserFromSession(session);
      } else if (event === 'SIGNED_OUT') {
        this.session = null;
        this.userSignal.set(null);
      }
    });
  }

  // Establecer el usuario desde la sesión

  private async setUserFromSession(session: Session | null) {
    if (!session) {
      this.userSignal.set(null);
      return;
    }
  
    const userMetadata = session.user.user_metadata;
    this.userSignal.set({
      user_id: session.user.id,
      githubusername: userMetadata['user_name'],
      fullname: userMetadata['full_name'],
      avatarurl: userMetadata['avatar_url']
    });
  
    await this.userService.getOrCreateUser(); // Llamar siempre que haya sesión
  }

  // Obtener el token de GitHub desde la sesión
  getGitHubToken(): string | null {
    return this.session?.provider_token ?? null;
  }

  // Iniciar sesión con GitHub
  async loginWithGithub() {
    await this.supabaseService.loginWithGithub(); // Solo realiza el login, sin más lógica aquí
  }

  // Cerrar sesión
  async logout() {
    await this.supabaseService.logout();
    this.session = null;
    this.userSignal.set(null); // Limpia el estado del usuario autenticado
    this.isOwnerSignal.set(false); // Restablece isOwner
    this.router.navigate(['/']); // Redirigir a la página de inicio
  }

  // Establecer el estado de propietario
  setOwnerStatus(githubusernameFromUrl: string) {
    const user = this.userSignal();
    if (user) {
      this.isOwnerSignal.set(user.githubusername === githubusernameFromUrl);
    } else {
      this.isOwnerSignal.set(false);
    }
  }


  async deleteUserAccount(): Promise<boolean> {
    if (!this.session?.user) {
      console.error('❌ No hay usuario autenticado.');
      return false;
    }
  
    const userId = this.session.user.id;
  
    // 🔥 1. Eliminar usuario de la tabla `users`
    const { error } = await this.supabaseService.client
      .from('users')
      .delete()
      .eq('user_id', userId);
  
    if (error) {
      console.error('❌ Error eliminando el usuario de la base de datos:', error);
      return false;
    }
  
    // 🔒 2. Cerrar sesión y redirigir
    await this.logout();
  
    return true;
  }

}