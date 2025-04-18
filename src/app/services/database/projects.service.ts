import { Injectable } from '@angular/core';
import { SupabaseService } from '../auth/supabase.service';
import { Project } from '../../interfaces/project';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private table = 'projects';

  constructor(
    private supabaseService: SupabaseService,
    private toastr: ToastrService
  ) {}

  async create(project: Partial<Project>): Promise<Project | null> {
    const session = await this.supabaseService.getSession();
    const token = session?.access_token;

    if (!token) {
      this.toastr.error('No hay token de sesión, el usuario no está autenticado.', 'Error');
      throw new Error('❌ No hay token de sesión, el usuario no está autenticado.');
    }

    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .insert(project)
      .select();

    if (error) {
      console.error('❌ Error al insertar proyecto en Supabase:', error);
      this.toastr.error('Error al crear el proyecto.', 'Error');
      throw error;
    }
    if (!data || data.length === 0) {
      this.toastr.warning('Proyecto creado, pero Supabase no devolvió datos.', 'Advertencia');
      return null;
    }

    this.toastr.success('Proyecto creado correctamente.', 'Éxito');
    return data[0] as Project;
  }

  async getUserProjects(username?: string): Promise<Project[]> {
    if (username) {
      // Obtener proyectos por username
      const { data, error } = await this.supabaseService.client
        .from(this.table)
        .select('*')
        .order('updated_at', { ascending: false }) 

        .eq('githubusername', username);
  
      if (error) {
        console.error('❌ Error al obtener proyectos por username:', error);
        throw error;
      }
  
      return data as Project[];
    } else {
      // Obtener proyectos del usuario autenticado
      const session = await this.supabaseService.getSession();
      const token = session?.access_token;
  
      if (!token) {
        throw new Error('❌ No hay token de sesión, el usuario no está autenticado.');
      }
  
      const userId = session?.user?.id;
  
      if (!userId) {
        throw new Error('❌ No se pudo obtener el ID del usuario.');
      }
  
      const { data, error } = await this.supabaseService.client
        .from(this.table)
        .select('*')
        .order('updated_at', { ascending: false }) 
        .eq('user_id', userId);
  
      if (error) {
        console.error('❌ Error al obtener proyectos del usuario autenticado:', error);
        throw error;
      }
  
      return data as Project[];
    }
  }
  async getByUsernameAndProjectName(username: string, projectName: string): Promise<Project | null> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .eq('githubusername', username)
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
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error('❌ No se pudo obtener el ID del usuario.');
    }

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

  async getPaginated(page: number, pageSize: number = 12): Promise<{ data: Project[]; total: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
  
    const { data, error, count } = await this.supabaseService.client
      .from(this.table)
      .select('*', { count: 'exact' }) // Obtener total de registros
      .order('updated_at', { ascending: false }) // Ordenar por fecha de actualización
      .range(from, to); // Paginación
  
    if (error) {
      console.error('❌ Error al obtener proyectos paginados:', error);
      throw error;
    }
  
    return { data: data as Project[], total: count ?? 0 };
  }

  transformImageUrl(imageUrl: string, size: 500 | 160 = 500): string {
    if (!imageUrl) return '/assets/img/default-placeholder.webp';
  
    const transformation =
      size === 160
        ? 'c_scale,w_160,q_auto'
        : 'c_fill,w_500,h_281,q_auto';
  
    return imageUrl.replace('/upload/', `/upload/${transformation}/`);
  }


  async update(projectId: string, updatedData: Partial<Project>): Promise<void> {
    const { error } = await this.supabaseService.client
      .from(this.table)
      .update(updatedData)
      .eq('id', projectId); // ✅ FIX: usar 'id' en lugar de 'project_id'
  
    if (error) {
      console.error('❌ Error al actualizar proyecto en Supabase:', error);
      this.toastr.error('Error al actualizar el proyecto.', 'Error');
      throw error;
    }
  
    this.toastr.success('Proyecto actualizado correctamente.', 'Éxito');
  }

  async getLatestProjects(limit: number = 4): Promise<Project[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .order('updated_at', { ascending: false }) // Cambiar a 'created_at' si prefieres
      .limit(limit);
  
    if (error) {
      console.error('❌ Error al obtener los últimos proyectos:', error);
      throw error;
    }
  
    return data as Project[];
  }

  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .order('updated_at', { ascending: false });
  
    if (error) {
      console.error('❌ Error al obtener todos los proyectos:', error);
      throw error;
    }
  
    return data as Project[];
  }
}