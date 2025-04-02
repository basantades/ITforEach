import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/supabase/auth.service';
import { UserService } from '../../services/database/user.service';
import { GithubUserService } from '../../services/api/github-user.service'; // Importar el servicio de GitHub
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  user = signal<User | null>(null); // Datos del usuario de la ficha

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public authService: AuthService,
    private githubUserService: GithubUserService // Inyectar el servicio de GitHub
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

  // Llamar al servicio de GitHub para obtener datos del usuario
  async getGitHubUser() {
    try {
      const githubUser = await this.githubUserService.getGitHubUser();
      console.log('Datos del usuario de GitHub:', githubUser);
    } catch (error) {
      console.error('Error al obtener datos del usuario de GitHub:', error);
    }
  }
}