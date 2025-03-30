import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
  useFactory: () => new CloudinaryService(inject(HttpClient)) // 👈 Inyección explícita
})
export class CloudinaryService {
  private cloudinaryUrl = environment.cloudinaryUploadUrl; 

  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset'); // Reemplaza con tu preset

    try {
      const response = await this.http.post<{ secure_url?: string }>(this.cloudinaryUrl, formData).toPromise();
      
      if (response?.secure_url) {
        return response.secure_url; // Retorna la URL de la imagen subida
      } else {
        throw new Error('La respuesta de Cloudinary no contiene una URL válida.');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
}
