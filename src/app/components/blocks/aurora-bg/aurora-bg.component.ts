import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginButtonComponent } from "../../ui/login-button/login-button.component";
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-aurora-bg',
  imports: [LoginButtonComponent, RouterLink],
  templateUrl: './aurora-bg.component.html',
  styleUrl: './aurora-bg.component.scss'
})
export class AuroraBgComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}
