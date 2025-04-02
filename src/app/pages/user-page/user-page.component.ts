import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/supabase/auth.service';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';
import { ProjectsByUserComponent } from "./projects-by-user/projects-by-user.component";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
  imports: [ProjectsByUserComponent]
})
export class UserPageComponent {
  user = signal<User | null>(null); // Datos del usuario de la ficha

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public authService: AuthService,
  ) {
    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(async (params) => {
      const githubusernameFromUrl = params.get('githubusername');
      if (githubusernameFromUrl) {
        // Obtener los datos del usuario desde UserService
        const userData = await this.userService.getUserByUsername(githubusernameFromUrl);
        this.user.set(userData);

        // Actualizar el estado de propietario en AuthService
        this.authService.setOwnerStatus(githubusernameFromUrl);
      }
    });
  }

}