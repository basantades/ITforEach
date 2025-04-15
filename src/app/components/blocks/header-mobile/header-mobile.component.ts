import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginButtonComponent } from '../../ui/login-button/login-button.component';
import { LogoutButtonComponent } from '../../ui/logout-button/logout-button.component';
import { BackButtonComponent } from "../../ui/back-button/back-button.component";
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-header-mobile',
  imports: [RouterLink, LoginButtonComponent, LogoutButtonComponent, BackButtonComponent, UserAvatarComponent],
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
