import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/supabase/auth.service';
import { LoginButtonComponent } from "../../../components/ui/login-button/login-button.component";
import { LogoutButtonComponent } from "../../../components/ui/logout-button/logout-button.component"; // Importar LogoutButtonComponent

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginButtonComponent, LogoutButtonComponent], // Agregar LogoutButtonComponent a imports
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}