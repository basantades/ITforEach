import { Component, Input, Signal } from '@angular/core';
import { User } from '../../../interfaces/user'; // ajusta si cambia la ruta
import { AuthService } from '../../../services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-profile-card.component.html'
})
export class UserProfileCardComponent {
  @Input() user!: Signal<User | null>;

  constructor(    public authService: AuthService,
  ) {}
}
