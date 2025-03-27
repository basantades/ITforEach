import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-project-button',
  templateUrl: './delete-project-button.component.html',
  styleUrls: ['./delete-project-button.component.scss']
})
export class DeleteProjectButtonComponent {
  @Input() projectId!: number; // Recibe el ID del proyecto a eliminar
  @Output() projectDeleted = new EventEmitter<number>(); // Emite el ID del proyecto eliminado

  confirmDelete: boolean = false;

  showConfirmation(): void {
    this.confirmDelete = true;
  }

  cancelDelete(): void {
    this.confirmDelete = false;
  }

  deleteProject(): void {
    this.projectDeleted.emit(this.projectId); // Emite el evento al componente padre
    this.confirmDelete = false;
  }
}