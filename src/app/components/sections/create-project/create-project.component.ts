import { Component, Input, Signal, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../interfaces/project';
import { ProjectsService } from '../../../services/database/projects.service';
import { JsonPipe } from '@angular/common';
import { SupabaseService } from '../../../services/supabase/supabase.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe], 
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);

  @Input() repoData!: Signal<Project>;
  languages = signal<Record<string, number>>({});

  projectForm = signal(
    this.fb.group({
      status: ['undefined', Validators.required],
      about_project: [''],
      main_image_url: [''],
      extra_images_urls: [[]]
    })
  );

  ngOnInit() {
    const repo = this.repoData();

    if (repo.repository_url) {
      const languagesUrl = repo.repository_url.replace('github.com', 'api.github.com/repos') + '/languages'; // ✅ CORRECTO

      fetch(languagesUrl)
        .then(response => response.json())
        .then(languages => {
          console.log('📊 Lenguajes obtenidos en create-project:', languages);
          this.languages.set(languages);
        })
        .catch(error => console.error('❌ Error obteniendo lenguajes:', error));
    }
  }

  constructor(private supabaseService: SupabaseService) {}


  async saveProject() {
    if (this.projectForm().invalid) return;

    const formValue = this.projectForm().value;


    const user = await this.supabaseService.getCurrentUser();
    console.log('🆔 ID del usuario autenticado:', user?.id);
    const session = await this.supabaseService.client.auth.getSession();
console.log("🔑 Token de sesión:", session?.data?.session?.access_token);
    
    if (!user) {
      console.error("❌ No hay usuario autenticado, no se puede crear el proyecto");
      return;
    }


    const newProject: Project = {
      ...this.repoData(),
      languages: this.languages(), // 🔥 Guardamos los lenguajes obtenidos en el proyecto
      ...formValue,
      status: (formValue.status ?? 'undefined') as Project['status'],
      about_project: formValue.about_project ?? undefined,
      main_image_url: formValue.main_image_url ?? undefined,
      extra_images_urls: formValue.extra_images_urls ?? [],
    };

    console.log('🛠 Proyecto a guardar:', newProject);

    try {
      await this.projectsService.create(newProject);
      alert('Proyecto guardado con éxito');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }
}
