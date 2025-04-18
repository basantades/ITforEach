import { Component, EventEmitter, Output } from '@angular/core';
import { CloudinaryService } from '../../../services/api/cloudinary.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html'
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter<string>();
  imagePreviewUrl: string | null = null;

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Muestra una preview local mientras se sube
      this.imagePreviewUrl = URL.createObjectURL(file);

      // Sube la imagen y actualiza el preview final
      this.cloudinaryService.uploadImage(file).then((url) => {
        this.imagePreviewUrl = url;
        this.imageUploaded.emit(url);
      });
    }
  }
}
