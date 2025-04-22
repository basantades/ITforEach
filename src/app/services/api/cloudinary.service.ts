import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root',
  useFactory: () => new CloudinaryService(inject(HttpClient), inject(NotificationService))
})

export class CloudinaryService {
  private cloudinaryUrl = environment.cloudinaryUploadUrl; 

  constructor(private http: HttpClient,
    private notification: NotificationService) {}

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset'); 

    try {
      const response = await this.http.post<{ secure_url?: string }>(this.cloudinaryUrl, formData).toPromise();
      
      if (response?.secure_url) {
        return response.secure_url; // Retorna la URL de la imagen subida
      } else {
        this.notification.showError('La respuesta de Cloudinary no contiene una URL válida.');
        throw new Error('La respuesta de Cloudinary no contiene una URL válida.');
      }
    } catch (error) {
      this.notification.logAndThrow(error, 'Error al subir la imagen.');
      throw error;
    }
  }
}
