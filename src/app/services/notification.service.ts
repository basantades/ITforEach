import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title = 'Éxito') {
    this.toastr.success(message, title);
  }

  showError(message: string, title = 'Error') {
    this.toastr.error(message, title);
  }

  showWarning(message: string, title = 'Advertencia') {
    this.toastr.warning(message, title);
  }

  showInfo(message: string, title = 'Información') {
    this.toastr.info(message, title);
  }

  logAndThrow(error: any, userMessage = 'Algo salió mal') {
    console.error('❌', error);
    this.showError(userMessage);
    throw error;
  }

  logAndReturn<T>(error: any, fallback: T, userMessage = 'Algo salió mal'): T {
    console.error('❌', error);
    this.showError(userMessage);
    return fallback;
  }
}
