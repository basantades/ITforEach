import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginButtonComponent } from '../../../components/ui/login-button/login-button.component';
import { LogoutButtonComponent } from '../../../components/ui/logout-button/logout-button.component';
import { BackButtonComponent } from "../../../components/ui/back-button/back-button.component";

@Component({
  selector: 'app-header-mobile',
  imports: [RouterLink, LoginButtonComponent, LogoutButtonComponent, BackButtonComponent],
  templateUrl: './header-mobile.component.html',
  styleUrl: './header-mobile.component.scss'
})

export class HeaderMobileComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal;

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
