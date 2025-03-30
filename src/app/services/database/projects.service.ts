import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Project } from '../../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private table = 'projects';

  constructor(private supabaseService: SupabaseService) {}

  async create(project: Partial<Project>): Promise<Project> {
    const session = await this.supabaseService.getSession();
    const token = session?.data?.session?.access_token;

    if (!token) {
      throw new Error('❌ No hay token de sesión, el usuario no está autenticado.');
    }

    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .insert(project);

    if (error) {
      console.error('❌ Error al insertar proyecto en Supabase:', error);
      throw error;
    }

    if (!data) {
      throw new Error('❌ La inserción no devolvió datos.');
    }

    return data as Project;
  }

  async getUserProjects(): Promise<Project[]> {
    const session = await this.supabaseService.getSession();
    const token = session?.data?.session?.access_token;

    if (!token) {
      throw new Error('❌ No hay token de sesión, el usuario no está autenticado.');
    }

    const userId = session?.data?.session?.user?.id;

    if (!userId) {
      throw new Error('❌ No se pudo obtener el ID del usuario.');
    }

    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error al obtener proyectos del usuario:', error);
      throw error;
    }

    return data as Project[];
  }

  async getByUsernameAndProjectName(username: string, projectName: string): Promise<Project | null> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .eq('githubUsername', username)  
      .eq('name', projectName)
      .single();
  
    if (error) {
      console.error('Error al obtener el proyecto:', error);
      return null;
    }
  
    return data as Project;
  }

  async delete(id: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.data?.session?.user?.id;
  
    const { error } = await this.supabaseService.client
      .from(this.table)
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('❌ Error al eliminar el proyecto:', error);
      throw error;
    }
      return true;
  }
  async getPaginated(page: number, pageSize: number = 24): Promise<{ data: Project[], total: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
  
    const { data, error, count } = await this.supabaseService.client
      .from(this.table)
      .select('*', { count: 'exact' }) // Obtener total de registros
      .order('created_at', { ascending: false }) // Ordenar por fecha de creación
      .range(from, to); // Paginación
  
    if (error) {
      console.error('❌ Error al obtener proyectos paginados:', error);
      throw error;
    }
  
    return { data: data as Project[], total: count ?? 0 };
  }

  transformImageUrl(imageUrl: string, width: number = 500, height: number = 281): string {
    return imageUrl.replace('/upload/', `/upload/c_fill,w_${width},h_${height},q_auto/`);
  }
}