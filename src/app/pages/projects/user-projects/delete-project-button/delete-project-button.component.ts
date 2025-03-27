import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '../../../../services/database/projects.service';

@Component({
  selector: 'app-delete-project-button',
  templateUrl: './delete-project-button.component.html',
  styleUrls: ['./delete-project-button.component.scss']
})
export class DeleteProjectButtonComponent {
  @Input() projectId!: number; // Recibe el ID del proyecto a eliminar
  @Output() projectDeleted = new EventEmitter<number>(); // Emite el ID del proyecto eliminado

  confirmDelete: boolean = false;

  constructor(private projectsService: ProjectsService) {}

  showConfirmation(): void {
    this.confirmDelete = true;
  }

  cancelDelete(): void {
    this.confirmDelete = false;
  }

  deleteProject(): void {
    // Llama al servicio para eliminar el proyecto
    this.projectsService.delete(this.projectId).then(() => {
      this.projectDeleted.emit(this.projectId); // Emite el evento al componente padre
      this.confirmDelete = false;
    }).catch((error) => {
      console.error(`❌ Error al eliminar el proyecto con ID ${this.projectId}:`, error);
    });
  }
}