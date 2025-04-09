import { Injectable } from '@angular/core';
import { SupabaseService } from '../auth/supabase.service';
import { Like } from '../../interfaces/like';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private table = 'likes';

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Añade un like a un proyecto.
   * @param projectId ID del proyecto al que se le da like.
   * @returns `true` si se añade correctamente, `false` si ya existe.
   */
  async addLike(projectId: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error('❌ No se pudo obtener el ID del usuario.');
    }

    // Verificar si el usuario ya ha dado like a este proyecto
    const { data: existingLike } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .maybeSingle();

    if (existingLike) {
      return false; // Ya existe el like
    }

    const { error } = await this.supabaseService.client.from(this.table).insert({
      user_id: userId,
      project_id: projectId,
    });

    if (error) {
      console.error('❌ Error al dar like:', error);
      throw error;
    }

    return true; // Like añadido correctamente
  }

  /**
   * Elimina un like de un proyecto.
   * @param projectId ID del proyecto al que se le quita el like.
   * @returns `true` si se elimina correctamente, `false` si no existía.
   */
  async removeLike(projectId: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      throw new Error('❌ No se pudo obtener el ID del usuario.');
    }
  
    const { error, data } = await this.supabaseService.client
      .from(this.table)
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .select(); // 👈 esto devuelve los registros eliminados
  
    if (error) {
      console.error('❌ Error al quitar like:', error);
      throw error;
    }
  
    return data.length > 0;
  }
  

  /**
   * Obtiene la cantidad de likes de un proyecto desde la vista `project_likes_count`.
   */
  async getLikesCount(projectId: number): Promise<number> {
    const { data, error } = await this.supabaseService.client
      .from('project_likes_count') // Vista creada en Supabase
      .select('likes')
      .eq('project_id', projectId)
      .maybeSingle();
  
    if (error) {
      console.error('❌ Error al obtener la cantidad de likes:', error);
      throw error;
    }
  
    return data?.likes ?? 0;
  }

  /**
   * Verifica si el usuario actual ha dado like a un proyecto.
   */
  async hasUserLiked(projectId: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return false; // Usuario no autenticado
    }

    const { data } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .maybeSingle();

    return !!data; // Retorna true si hay un like, false si no
  }
}
