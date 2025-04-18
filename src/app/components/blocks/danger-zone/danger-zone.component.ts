import { Component, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-danger-zone',
  standalone: true,
  imports: [CommonModule, ModalComponent ],
  templateUrl: './danger-zone.component.html'
})
export class DangerZoneComponent {
  confirmStep1 = signal(false);
  confirmStep2 = signal(false);
  confirmText = signal('');

  constructor(private authService: AuthService) {}

  openConfirmStep1() {
    this.confirmStep1.set(true);
  }

  cancelStep1() {
    this.confirmStep1.set(false);
  }

  proceedToStep2() {
    this.confirmStep1.set(false);
    this.confirmStep2.set(true);
  }

  cancelStep2() {
    this.confirmStep2.set(false);
    this.confirmText.set('');
  }

  async confirmDeletion() {
    if (this.confirmText() === 'Delete') {
      const success = await this.authService.deleteUserAccount();
      if (success) {
        this.confirmStep2.set(false);
      } else {
        // Podrías poner algún toast de error si falla
        alert('Hubo un error al eliminar tu cuenta.');
      }
    }
  }
}
