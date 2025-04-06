import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';
import { ProjectsByUserComponent } from "./projects-by-user/projects-by-user.component";
// import { ModalComponent } from "../../components/ui/modal/modal.component";
// import { EditProfileComponent } from "../edit-profile/edit-profile.component";
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
  imports: [ProjectsByUserComponent, RouterLink],
})
export class UserPageComponent {
  user = signal<User | null>(null);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public authService: AuthService,
  ) {
    this.route.paramMap.subscribe(async (params) => {
      const githubusernameFromUrl = params.get('githubusername');
      if (githubusernameFromUrl) {
        const userData = await this.userService.getUserByUsername(githubusernameFromUrl);
        this.user.set(userData);
        this.authService.setOwnerStatus(githubusernameFromUrl);
      }
    });
  }
}
