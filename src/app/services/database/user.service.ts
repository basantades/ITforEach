import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  /** 🔥 Obtiene el usuario desde la tabla `users`, o lo crea si no existe */
  async getOrCreateUser(): Promise<User | null> {
    const session = await this.supabaseService.getSession();
    if (!session?.user) {
      console.error('❌ No hay sesión activa o usuario autenticado.');
      return null;
    }
  
    const userId = session.user.id;
    const metadata = session.user.user_metadata || {};
  
    const { data: existingUser, error: userError } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
  
    if (existingUser) {
      return existingUser;
    }
  
    if (userError && userError.code !== 'PGRST116') {
      return null;
    }
  
    const newUser: User = {
      user_id: userId,
      githubusername: metadata["user_name"] || '',
      fullname: metadata["full_name"] || '',
      avatarurl: metadata["avatar_url"] || '',
      email: null,
      bio: null,
      sociallinks: null,
      website: null,
      links: null
    };
  
    const { data: newUserData, error: insertError } = await this.supabaseService.client
      .from('users')
      .insert(newUser)
      .select()
      .single();  // Agregamos `.select().single()` para asegurarnos de que devuelve datos
  
    if (insertError) {
      console.error('❌ Error insertando usuario en users:', insertError);
      return null;
    }
  
    return newUserData;
  }
  

  /** 🔍 Obtiene un usuario por su GitHub username */
  async getUserByUsername(githubusername: string): Promise<User | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('githubusername', githubusername)
      .single();

    if (error) {
      console.error('❌ Error obteniendo usuario por GitHub username:', error);
      return null;
    }

    return data as User;
  }

 /** ✏️ Edita el usuario en la tabla `users` */
async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await this.supabaseService.client
    .from('users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('❌ Error actualizando usuario:', error);
    return null;
  }

  return data; // ✅ Retorna el usuario actualizado
}
}