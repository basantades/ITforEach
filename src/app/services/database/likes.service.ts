import { Injectable } from '@angular/core';
import { SupabaseService } from '../auth/supabase.service';
import { Like } from '../../interfaces/like';
import { NotificationService } from '../notification.service';


@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private table = 'likes';

  constructor(private supabaseService: SupabaseService,
    private notification: NotificationService) {}


  async addLike(projectId: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      this.notification.showError('No se pudo obtener el ID del usuario.');
      throw new Error('No hay ID de usuario.');
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

    if (error) this.notification.logAndThrow(error, 'Error al dar like.');

    return true; // Like añadido correctamente
  }

  async removeLike(projectId: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      this.notification.showError('No se pudo obtener el ID del usuario.');
      throw new Error('No hay ID de usuario.');
    }
  
    const { error, data } = await this.supabaseService.client
      .from(this.table)
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .select(); // 👈 esto devuelve los registros eliminados
  
    if (error) {
      this.notification.logAndThrow(error, 'Error al quitar like.');
    }
  
    return !!data && data.length > 0;
  }
  

  async getLikesCount(projectId: number): Promise<number> {
    const { data, error } = await this.supabaseService.client
      .from('project_likes_count')
      .select('likes_count') 
      .eq('project_id', projectId)
      .maybeSingle();
  
    if (error) this.notification.logAndThrow(error, 'Error al obtener la cantidad de likes.');
  
    return data?.likes_count ?? 0; 
  }

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
