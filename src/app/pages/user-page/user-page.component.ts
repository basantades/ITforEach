import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/supabase/auth.service';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';
import { ProjectsByUserComponent } from "./projects-by-user/projects-by-user.component";
import { ModalComponent } from "../../components/ui/modal/modal.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
  imports: [ProjectsByUserComponent, ModalComponent, EditProfileComponent],
})
export class UserPageComponent {
  user = signal<User | null>(null);
  showModal = signal(false);

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

  openModal() {
    if (!this.user()) {
      console.error('⚠️ No hay usuario disponible para editar.');
      return;
    }
    this.showModal.set(true); // 🔥 Solo abrimos el modal
  }

  closeModal() {
    this.showModal.set(false);
  }

  async onProfileUpdated() {
    const githubusername = this.user()?.githubusername;
    if (githubusername) {
      const updatedUserData = await this.userService.getUserByUsername(githubusername);
      this.user.set(updatedUserData); // 🔥 Forzar actualización del signal con nuevos datos
    }
    this.closeModal(); // Cierra el modal después de actualizar
  }
}
