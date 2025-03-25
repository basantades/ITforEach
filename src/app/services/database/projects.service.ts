import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Project } from '../../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private table = 'projects';

  constructor(private supabaseService: SupabaseService) {}

  // 🔥 Crear un proyecto
  async create(project: Partial<Project>): Promise<Project> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
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
  async getById(id: number): Promise<Project> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Project;
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
