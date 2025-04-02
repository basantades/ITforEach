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
    const { data: authUser, error: authError } = await this.supabaseService.client.auth.getUser();
    if (authError || !authUser.user) {
      console.error('❌ Error obteniendo usuario de auth:', authError);
      return null;
    }

    const userId = authUser.user.id;
    const metadata = authUser.user.user_metadata || {};

    // 🔍 Buscar usuario en `users`
    const { data: existingUser, error: userError } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingUser) {
      return existingUser; // ✅ Usuario ya existe, devolverlo
    }

    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Error consultando users:', userError);
      console.log('Detalles del error:', userError.details);
      return null;
    }

    // 🆕 Crear usuario en `users`
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
      .insert(newUser);

    if (insertError) {
      console.error('❌ Error insertando usuario en users:', insertError);
      console.log('Detalles del error:', insertError.details);
      return null;
    }

    return newUserData; // ✅ Usuario creado correctamente
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

  /** 🔄 Actualiza los datos de un usuario */
  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ Error actualizando usuario:', error);
      return null;
    }

    return data as User;
  }
}