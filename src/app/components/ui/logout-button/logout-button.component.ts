import { Component } from '@angular/core';
import { AuthService } from '../../../services/supabase/auth.service';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout(); // Llamar al método logout del AuthService
  }
}