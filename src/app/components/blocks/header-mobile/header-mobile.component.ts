import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginButtonComponent } from '../../ui/login-button/login-button.component';
import { LogoutButtonComponent } from '../../ui/logout-button/logout-button.component';
import { BackButtonComponent } from "../../ui/back-button/back-button.component";
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-header-mobile',
  imports: [RouterLink, RouterModule, LoginButtonComponent, LogoutButtonComponent, BackButtonComponent, UserAvatarComponent],
  templateUrl: './header-mobile.component.html'
})

export class HeaderMobileComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal;

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(open => {
      const newState = !open;
      document.body.style.overflow = newState ? 'hidden' : 'auto';
      return newState;
    });
  }
  
  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  ngOnInit() {
    window.addEventListener('resize', this.handleResize);
  }
  
  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize = () => {
    if (window.innerWidth >= 640 && this.isMenuOpen()) {
      this.closeMenu(); // También reestablece el scroll
      document.body.style.overflow = 'auto';
    }
  }
}
