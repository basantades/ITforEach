import { Component, Input, Signal, signal, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../interfaces/project';
import { ProjectsService } from '../../../services/database/projects.service';
import { JsonPipe } from '@angular/common';
import { SupabaseService } from '../../../services/auth/supabase.service';
import { ImageUploadComponent } from '../edit-project/image-upload/image-upload.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, ImageUploadComponent], 
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
  @Output() projectCreated = new EventEmitter<void>();
  private fb = inject(FormBuilder);
  projectsService = inject(ProjectsService);
  imageUrl = signal<string | null>(null);

  @Input() repoData!: Signal<Project>;
  languages = signal<Record<string, number>>({});
  githubusername = signal<string | null>(null);

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
        this.githubusername.set(repoData.owner.login);
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
      githubusername: this.githubusername() ?? '',
      ...formValue,
      status: (formValue.status ?? 'undefined') as Project['status'],
      about_project: formValue.about_project ?? '',
      main_image_url: formValue.main_image_url ?? '',
      extra_images_urls: formValue.extra_images_urls ?? [],
    };

    try {
      await this.projectsService.create(newProject);
      this.projectCreated.emit();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }
  
  onImageUploaded(url: string) {
    this.imageUrl.set(url); // Usamos .set() para actualizar el signal
    this.projectForm.get('main_image_url')?.setValue(url); // También actualizamos el formulario
  }

  onUrlChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim(); // Eliminamos espacios en blanco

    this.imageUrl.set(url || null);
  }
}
