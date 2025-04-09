import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LoginButtonComponent } from "../../components/ui/login-button/login-button.component";
import { AuroraBgComponent } from "../../components/blocks/aurora-bg/aurora-bg.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoginButtonComponent, AuroraBgComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}