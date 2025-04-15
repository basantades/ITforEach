import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SupabaseService } from '../services/auth/supabase.service';
import { Project } from '../interfaces/project';

@Injectable({ providedIn: 'root' })
export class PublicProjectResolver implements Resolve<Project | null> {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async resolve(route: ActivatedRouteSnapshot): Promise<Project | null> {
    const githubusername = route.paramMap.get('githubusername');
    const projectName = route.paramMap.get('projectName');

    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .eq('githubusername', githubusername)
      .eq('name', projectName)
      .single();

    if (error || !data) {
      this.router.navigate(['/404']);
      return null;
    }

    return data as Project;
  }
}
