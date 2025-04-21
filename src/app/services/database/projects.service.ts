import { Injectable } from '@angular/core';
import { SupabaseService } from '../auth/supabase.service';
import { Project } from '../../interfaces/project';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private table = 'projects';

  constructor(
    private supabaseService: SupabaseService,
    private notification: NotificationService,
    private authService: AuthService
  ) {}

  async create(project: Partial<Project>): Promise<Project | null> {
    const session = await this.supabaseService.getSession();
    const token = session?.access_token;

    if (!token) {
      this.notification.showError('No hay token de sesión, el usuario no está autenticado.', 'Error');
      throw new Error('No hay token de sesión, el usuario no está autenticado.');
    }

    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .insert(project)
      .select();

    if (error) {
      console.error('Error al insertar proyecto en Supabase:', error);
      this.notification.showError('Error al crear el proyecto.', 'Error');
      throw error;
    }
    if (!data || data.length === 0) {
      this.notification.showWarning('Proyecto creado, pero Supabase no devolvió datos.', 'Advertencia');
      return null;
    }

    this.notification.showSuccess('Proyecto creado correctamente.', 'Éxito');
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
        this.notification.logAndThrow(error, 'Error al obtener proyectos por username.');
      }
      return data as Project[];
    } else {
      // Obtener proyectos del usuario autenticado
      const session = await this.supabaseService.getSession();
      const token = session?.access_token;
  
      if (!token) {
        this.notification.showError('No hay token de sesión, el usuario no está autenticado.', 'Error'); 
        throw new Error('No hay token de sesión, el usuario no está autenticado.');
      }
  
      const userId = session?.user?.id;
      if (!userId) {
        this.notification.showError('No se pudo obtener el ID del usuario.', 'Error'); 
        throw new Error('No se pudo obtener el ID del usuario.');
      }
  
      const { data, error } = await this.supabaseService.client
        .from(this.table)
        .select('*')
        .order('updated_at', { ascending: false }) 
        .eq('user_id', userId);
  
      if (error) {
        this.notification.logAndThrow(error, 'Error al obtener proyectos del usuario autenticado:');
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

    if (error) this.notification.logAndThrow(error, 'Error al obtener el proyecto');

    return data as Project;
  }

async delete(projectId: number): Promise<boolean> {
  const isOwner = await this.isOwnerOfProject(projectId);
  if (!isOwner) {
    this.notification.showError('No tienes permiso para eliminar este proyecto.', 'Error');
    throw new Error('No autorizado.');
  }

  const { error } = await this.supabaseService.client
    .from(this.table)
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error al eliminar el proyecto:', error);
    this.notification.showError('Error al eliminar el proyecto.', 'Error');
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
  
    if (error) this.notification.logAndThrow(error, 'Error al obtener proyectos paginados.');

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


  async update(projectId: number, updatedData: Partial<Project>): Promise<void> {
    const isOwner = await this.isOwnerOfProject(projectId);
    if (!isOwner) {
      this.notification.showError('No tienes permiso para editar este proyecto.', 'Error');
      throw new Error('No autorizado.');
    }
  
    const { error } = await this.supabaseService.client
      .from(this.table)
      .update(updatedData)
      .eq('id', projectId);
  
    if (error) {
      console.error('Error al actualizar proyecto en Supabase:', error);
      this.notification.showError('Error al actualizar el proyecto.', 'Error');
      throw error;
    }
  
    this.notification.showSuccess('Proyecto actualizado correctamente.', 'Éxito');
  }
  
  

  async getLatestProjects(limit: number = 4): Promise<Project[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .order('updated_at', { ascending: false }) // Cambiar a 'created_at' si prefieres
      .limit(limit);
  
    if (error) this.notification.logAndThrow(error, 'Error al obtener los últimos proyectos.');
    return data as Project[];
  }

  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .order('updated_at', { ascending: false });
  
    if (error) this.notification.logAndThrow(error, 'Error al obtener todos los proyectos.');
  
    return data as Project[];
  }

  private async isOwnerOfProject(projectId: number): Promise<boolean> {
    const session = await this.supabaseService.getSession();
    const userId = session?.user?.id;
  
    if (!userId) return false;
  
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('user_id')
      .eq('id', projectId)
      .single();
  
      if (error || !data) {
        console.warn('No se pudo verificar propiedad del proyecto:', error);
        return false;
      }  
    return data.user_id === userId;
  }
  
}