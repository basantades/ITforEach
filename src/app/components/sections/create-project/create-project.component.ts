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
  githubUsername = signal<string | null>(null);

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
      const repoApiUrl = repo.repository_url.replace('github.com', 'api.github.com/repos'); // URL de la API del repositorio
  
      fetch(repoApiUrl)
  .then(response => {
    console.log('🔍 Respuesta obtenida del repo:', response);
    return response.json();
  })
  .then(repoData => {
    console.log('🔍 Datos completos del repositorio:', repoData);
    if (repoData.owner?.login) {
      this.githubUsername.set(repoData.owner.login);
      console.log('✅ GitHub Username obtenido:', repoData.owner.login);
    } else {
      console.warn('⚠️ No se encontró el owner.login en los datos del repo.');
    }
  })
  .catch(error => console.error('❌ Error obteniendo datos del repositorio:', error));
  
      // Obtener lenguajes
      const languagesUrl = `${repoApiUrl}/languages`;
      console.log('🔍 Obteniendo lenguajes:', languagesUrl);
      fetch(languagesUrl)
        .then(response => response.json())
        .then(languages => {
          this.languages.set(languages);
          console.log('🔍 Lenguajes obtenidos:', languages);
        })
        .catch(error => console.error('❌ Error obteniendo lenguajes:', error));
  
      // Obtener datos del propietario (owner.login)
      fetch(repoApiUrl)
        .then(response => response.json())
        .then(repoData => {
          if (repoData.owner?.login) {
            this.githubUsername.set(repoData.owner.login); // Guardar githubUsername en el Signal
            console.log('🔍 GitHub Username obtenido:', repoData.owner.login);
          }
        })
        .catch(error => console.error('❌ Error obteniendo datos del repositorio:', error));
    }
  }

  constructor(private supabaseService: SupabaseService) {}


  async saveProject() {
    if (this.projectForm().invalid) return;

    const formValue = this.projectForm().value;

    const newProject: Project = {
      ...this.repoData(),
      languages: this.languages(), // 🔥 Guardamos los lenguajes obtenidos en el proyecto
      githubUsername: this.githubUsername() ?? '', // Añadimos githubUsername desde el Signal, con valor por defecto
      ...formValue,
      status: (formValue.status ?? 'undefined') as Project['status'],
      about_project: formValue.about_project ?? undefined,
      main_image_url: formValue.main_image_url ?? undefined,
      extra_images_urls: formValue.extra_images_urls ?? [],
    };

    try {
      await this.projectsService.create(newProject);
      alert('Proyecto guardado con éxito');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }
}
