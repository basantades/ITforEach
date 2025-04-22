import { Component, Input, Signal, signal, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../interfaces/project';
import { ProjectsService } from '../../../services/database/projects.service';
import { SupabaseService } from '../../../services/auth/supabase.service';
import { Router } from '@angular/router';
import { UploadImgComponent } from "../../blocks/upload-img/upload-img.component";


@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, UploadImgComponent],
  templateUrl: './project-form.component.html'
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  @Input() repoData!: Signal<Project | null>;
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() projectSaved = new EventEmitter<void>();

  imageUrl = signal<string | null>(null);
  languages = signal<Record<string, number>>({});
  githubusername = signal<string | null>(null);

  projectForm = this.fb.group({
    status: ['undefined', Validators.required],
    about_project: [''],
    main_image_url: [''],
    extra_images_urls: [[] as string[]]
  });

  async ngOnInit() {
    
    const repo = this.repoData();
    if (!repo?.repository_url) return;

    const repoApiUrl = repo.repository_url.replace('github.com', 'api.github.com/repos');

    try {
      const [repoData, langs] = await Promise.all([
        fetch(repoApiUrl).then(res => res.json()),
        fetch(`${repoApiUrl}/languages`).then(res => res.json())
      ]);

      if (repoData.owner?.login) this.githubusername.set(repoData.owner.login);
      this.languages.set(langs);

      if (this.mode === 'edit') {
        this.projectForm.patchValue({
          status: repo.status,
          about_project: repo.about_project,
          main_image_url: repo.main_image_url,
          extra_images_urls: repo.extra_images_urls ?? []
        });
        this.imageUrl.set(repo.main_image_url || null);
      }

    } catch (error) {
      console.error('❌ Error obteniendo datos del repositorio:', error);
    }
  }

  async save() {
    if (this.projectForm.invalid) return;

    const repo = this.repoData();
    if (!repo) return; // Previene acceso a propiedades de null

    const formValue = this.projectForm.value;

    const validStatuses = ['undefined', 'in_progress', 'testing', 'completed', 'paused'] as const;
    type ValidStatus = typeof validStatuses[number];

    const status: ValidStatus = validStatuses.includes(formValue.status as ValidStatus)
      ? (formValue.status as ValidStatus)
      : 'undefined';

    const project: Partial<Project> = {
      ...repo,
      githubusername: this.githubusername() ?? '',
      languages: this.languages(),
      status,
      about_project: formValue.about_project ?? '',
      main_image_url: formValue.main_image_url ?? '',
      extra_images_urls: formValue.extra_images_urls ?? [],
    };

    try {
      if (this.mode === 'edit' && repo.id) {
        await this.projectsService.update(repo.id, project); // <-- CORRECTO
        this.router.navigate(['/', project.githubusername, project.name]);
      } else {
        await this.projectsService.create(project);
        this.router.navigate(['/', project.githubusername, project.name]);
      }
    
      this.projectSaved.emit();
    } catch (error) {
      console.error('❌ Error al guardar proyecto:', error);
    }
    
  }

  onImageUploaded(url: string) {
    this.imageUrl.set(url);
    this.projectForm.get('main_image_url')?.setValue(url);
  }

  onUrlChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    this.imageUrl.set(url || null);
  }
}
