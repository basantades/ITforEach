import { Component, Input, Signal, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../interfaces/project';
import { ProjectsService } from '../../../services/database/projects.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe], 
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);

  @Input() repoData!: Signal<Project>;

  projectForm = signal(
    this.fb.group({
      status: ['undefined', Validators.required],
      about_project: [''],
      main_image_url: [''],
      extra_images_urls: [[]]
    })
  );

  async saveProject() {
    if (this.projectForm().invalid) return;

    const formValue = this.projectForm().value;

    const newProject: Project = {
      ...this.repoData(),
      ...formValue,
      status: (formValue.status ?? 'undefined') as Project['status'],
      about_project: formValue.about_project ?? undefined,
      main_image_url: formValue.main_image_url ?? undefined,
      extra_images_urls: formValue.extra_images_urls ?? [],
      collaborators: this.repoData().collaborators ?? []
    };

    try {
      await this.projectsService.create(newProject);
      alert('Proyecto guardado con éxito');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }
}
