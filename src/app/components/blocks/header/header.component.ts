import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginButtonComponent } from "../../../components/ui/login-button/login-button.component";
import { LogoutButtonComponent } from "../../../components/ui/logout-button/logout-button.component";
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component"; // Importar LogoutButtonComponent

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, LoginButtonComponent, LogoutButtonComponent, UserAvatarComponent], // Agregar LogoutButtonComponent a imports
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService

  isDropdownOpen = false; // Estado para controlar el menú desplegable

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Alternar el estado
  }

  closeDropdown() {
    this.isDropdownOpen = false; // Cerrar el menú
  }

}