import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '../../interfaces/user';
import { Session } from '@supabase/supabase-js';
import { UserService } from '../database/user.service'; 
import { Router } from '@angular/router'; 
import { NotificationService } from '../notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSignal = signal<User | null>(null); // Usuario autenticado
  isOwnerSignal = signal(false); // Indica si el usuario autenticado es el propietario
  private session: Session | null = null; // Sesión actual

  constructor(private supabaseService: SupabaseService, 
    private userService: UserService, 
    private router: Router,
    private notification: NotificationService) { 
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

  private async setUserFromSession(session: Session | null) {
    if (!session) {
      this.userSignal.set(null);
      return;
    }
  
    const user = await this.userService.getOrCreateUser();
    if (user) {
      this.userSignal.set(user);
    } else {
      // fallback si falla getOrCreateUser
      const userMetadata = session.user.user_metadata;
      this.userSignal.set({
        user_id: session.user.id,
        githubusername: userMetadata['user_name'],
        fullname: userMetadata['full_name'],
        avatarurl: userMetadata['avatar_url']
      });
    }
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

    try {
      await this.supabaseService.logout();
      this.notification.showSuccess('Sesión cerrada correctamente.');
    } catch (error) {
      this.notification.logAndThrow(error, 'Error cerrando sesión.');
    }

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


  async deleteUserAccount(): Promise<{ success: boolean; message: string }> {
    if (!this.session?.user) {
      this.notification.showError('No hay usuario autenticado.');
      return { success: false, message: 'No hay usuario autenticado.' };
    }

    const userId = this.session.user.id;
  
    try {
      const { error } = await this.supabaseService.client
        .from('users')
        .delete()
        .eq('user_id', userId);
  
      if (error) {
      this.notification.logAndThrow(error, 'Error al eliminar cuenta.');
      return { success: false, message: 'Error al eliminar tu cuenta. Intenta más tarde.' };
    }
  
    await this.logout();
    this.notification.showSuccess('Cuenta eliminada correctamente.');
    return { success: true, message: 'Cuenta eliminada correctamente.' };

  } catch (err) {
    this.notification.logAndThrow(err, 'Error inesperado al eliminar tu cuenta.');
    return { success: false, message: 'Error inesperado al eliminar tu cuenta.' };
  }
  }

}