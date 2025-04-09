
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CloudinaryService } from '../../../services/api/cloudinary.service';

@Component({
  selector: 'app-upload-img',
  standalone: true,
  templateUrl: './upload-img.component.html',
})
export class UploadImgComponent {
  @Input() initialImageUrl: string | null = null;
  @Output() imageUploaded = new EventEmitter<string>();

  imagePreviewUrl: string | null = null;

  constructor(private cloudinaryService: CloudinaryService) {}

  get displayImage(): string | null {
    return this.imagePreviewUrl || this.initialImageUrl;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagePreviewUrl = URL.createObjectURL(file);

      this.cloudinaryService.uploadImage(file).then((url) => {
        this.imagePreviewUrl = url;
        this.imageUploaded.emit(url);
      });
    }
  }
}
