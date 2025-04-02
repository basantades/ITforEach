import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/supabase/auth.service';
import { LoginButtonComponent } from "../../components/ui/login-button/login-button.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoginButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}