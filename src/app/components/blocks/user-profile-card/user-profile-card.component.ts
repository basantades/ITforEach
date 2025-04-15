import { Component, Input, Signal } from '@angular/core';
import { User } from '../../../interfaces/user'; // ajusta si cambia la ruta
import { AuthService } from '../../../services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [
    RouterLink,
    UserAvatarComponent
],
  templateUrl: './user-profile-card.component.html'
})
export class UserProfileCardComponent {
  @Input() user!: Signal<User | null>;

  constructor(    public authService: AuthService,
  ) {}
}
