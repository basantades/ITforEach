import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from "../modal/modal.component";
import { LikeCounterComponent } from "../like-counter/like-counter.component";


@Component({
  selector: 'app-delete-project-button',
  templateUrl: './delete-project-button.component.html',
  imports: [ModalComponent, LikeCounterComponent]
})
export class DeleteProjectButtonComponent {
  @Input() projectId!: number; // Recibe el ID del proyecto a eliminar
  @Input() projectName!: string; 
  

  @Output() projectDeleted = new EventEmitter<number>(); // Emite el ID del proyecto eliminado

  confirmDelete: boolean = false;

  constructor(private projectsService: ProjectsService, private toastr: ToastrService) {}

  showConfirmation() {
    this.confirmDelete = true;
  }


  cancelDelete() {
    this.confirmDelete = false;
  }

  deleteProject(): void {
    // Llama al servicio para eliminar el proyecto
    this.projectsService.delete(this.projectId).then(() => {
      this.projectDeleted.emit(this.projectId); // Emite el evento al componente padre
      this.confirmDelete = false;
      this.toastr.success('Proyecto eliminado correctamente', 'Eliminado con exito');

    }).catch((error) => {
      console.error(`❌ Error al eliminar el proyecto con ID ${this.projectId}:`, error);
      this.toastr.error('Hubo un error al eliminar el proyecto', 'Error');

    });
  }





}