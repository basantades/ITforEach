import { Component, EventEmitter, Output } from '@angular/core';
import { CloudinaryService } from '../../../services/api/cloudinary.service';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter<string>();

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.cloudinaryService.uploadImage(file).then((url) => {
        this.imageUploaded.emit(url); // Envía la URL al formulario
      });
    }
  }
}
