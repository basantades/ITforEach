import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';
import { ProjectsByUserComponent } from "../../components/sections/projects-by-user/projects-by-user.component";
import { UserProfileCardComponent } from "../../components/blocks/user-profile-card/user-profile-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  imports: [ProjectsByUserComponent, UserProfileCardComponent, CommonModule],
})
export class UserPageComponent {
  user = signal<User | null>(null);
  projectCount = signal<number>(0);
  containerClass = signal<string>('pt-8 lg:max-w-1/3');

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public authService: AuthService,
  ) {
    // ⚡ Carga de usuario desde la URL
    this.route.paramMap.subscribe(async (params) => {
      const githubusernameFromUrl = params.get('githubusername');
      if (githubusernameFromUrl) {
        const userData = await this.userService.getUserByUsername(githubusernameFromUrl);
        this.user.set(userData);
        this.authService.setOwnerStatus(githubusernameFromUrl);
      }
    });

    effect(() => {
      const count = this.projectCount();

      if (count === 0 && this.authService.isOwnerSignal()) {
        this.containerClass.set('pt-8 lg:w-1/3');
      } else if (count === 0) {
        this.containerClass.set('hidden'); 
      } else if (count === 1) {
        this.containerClass.set('pt-8 lg:w-1/3');
      } else {
        this.containerClass.set('pt-8 lg:w-2/3');
      }
    });
  }
}
