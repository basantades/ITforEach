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
  
    return data;
  }
  
  

  // 🔥 Obtener todos los proyectos (público)
  async getAll(): Promise<Project[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*');

    if (error) throw error;
    return data as Project[];
  }

  // 🔥 Obtener proyecto por ID (con .single() para recibir un solo objeto)

  async getById(id: number): Promise<Project | null> {
    try {
      const { data, error } = await this.supabaseService.client
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }
      return data as Project;
    } catch (err) {
      console.error('Unexpected error in getById:', err);
      return null;
    }
  }

  // 🔥 Actualizar proyecto por ID (solo si es el autor, eso ya lo compruebas fuera)
  async update(id: number, project: Partial<Project>): Promise<Project> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  }

  // 🔥 Eliminar proyecto por ID
  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabaseService.client
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
