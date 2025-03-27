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

  projectForm = this.fb.group({
    status: ['undefined', Validators.required],
    about_project: [''],
    main_image_url: [''],
    extra_images_urls: [[]]
  });

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const repo = this.repoData();
    if (!repo.repository_url) return;

    const repoApiUrl = repo.repository_url.replace('github.com', 'api.github.com/repos');

    try {
      // Ejecutar ambas peticiones en paralelo con Promise.all
      const [repoData, languages] = await Promise.all([
        fetch(repoApiUrl).then(res => res.json()),
        fetch(`${repoApiUrl}/languages`).then(res => res.json())
      ]);

      if (repoData.owner?.login) {
        this.githubUsername.set(repoData.owner.login);
      }
      this.languages.set(languages);

    } catch (error) {
      console.error('❌ Error obteniendo datos del repositorio:', error);
    }
  }
  

  async saveProject() {
    if (this.projectForm.invalid) return;

    const formValue = this.projectForm.value;

    const newProject: Project = {
      ...this.repoData(),
      languages: this.languages(),
      githubUsername: this.githubUsername() ?? '',
      ...formValue,
      status: (formValue.status ?? 'undefined') as Project['status'],
      about_project: formValue.about_project ?? '',
      main_image_url: formValue.main_image_url ?? '',
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
