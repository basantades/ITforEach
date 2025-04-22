import { Injectable } from '@angular/core';
import { SupabaseService } from '../auth/supabase.service';
import { User } from '../../interfaces/user';
import { NotificationService } from '../notification.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabaseService: SupabaseService,
    private notification: NotificationService) {}

  async getOrCreateUser(): Promise<User | null> {
  const session = await this.supabaseService.getSession();

  if (!session?.user) {
    this.notification.showError('No hay sesión activa o usuario autenticado.');
    return null;
  }

  const userId = session.user.id;
  const metadata = session.user.user_metadata || {};
  const githubusername = String(metadata["user_name"] || '').trim();
  const fullname = String(metadata["full_name"] || '').trim();
  const avatarurl = String(metadata["avatar_url"] || '').trim();

  const { data: existingUser, error: userError } = await this.supabaseService.client
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existingUser) {
    return existingUser;
  }
  

  if (userError && userError.code !== 'PGRST116') {
    this.notification.logAndThrow(userError, 'Error buscando usuario existente.');
    return null;
  }

  const newUser: User = {
    user_id: userId,
    githubusername,
    fullname,
    avatarurl,
    email: null,
    bio: null,
    website: null,
    linkedin: null,
  };

  const { data: newUserData, error: insertError } = await this.supabaseService.client
    .from('users')
    .insert(newUser)
    .select()
    .single();

  if (insertError) {
    this.notification.logAndThrow(insertError, 'Error al crear un nuevo usuario.');
    return null;
  }

  this.notification.showSuccess('Usuario creado correctamente.');
  return newUserData;  
}

  
  async getUserByUsername(githubusername: string): Promise<User | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('githubusername', githubusername)
      .single();

      if (error) {
        this.notification.logAndThrow(error, 'Error obteniendo usuario por GitHub username.');
        return null;
      }

    return data as User;
  }

async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await this.supabaseService.client
    .from('users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

    if (error) {
      this.notification.logAndThrow(error, 'Error actualizando usuario.');
      return null;
    }

    this.notification.showSuccess('Perfil actualizado correctamente.');
    return data;
}

async getAllUsers(): Promise<User[]> {
  const { data, error } = await this.supabaseService.client
    .from('users')
    .select('*')
    .order('created_at', { ascending: false }); 

    if (error) {
      this.notification.logAndThrow(error, 'Error al obtener todos los usuarios.');
      throw error;
    }

  return data as User[];
}

}