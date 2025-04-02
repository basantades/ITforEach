import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/supabase/auth.service';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';
import { GithubUserService } from '../../services/api/github-user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  user = signal<User | null>(null); // Datos del usuario de la ficha

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService, // Servicio para autenticación
    private userService: UserService, // Servicio para obtener datos del usuario
    public githubuserService: GithubUserService // Servicio para obtener datos de GitHub
  ) {
    // Obtener el usuario desde los datos de la ruta
    this.route.data.subscribe(async () => {
      const githubusernameFromUrl = this.route.snapshot.paramMap.get('githubusername');

      // Obtener los datos del usuario desde UserService
      const userData = await this.userService.getUserByUsername(githubusernameFromUrl!);
      this.user.set(userData);

      // Actualizar el estado de propietario en AuthService
      this.authService.setOwnerStatus(githubusernameFromUrl ?? '');
    });
  }

  // Método para obtener datos de GitHub
  async fetchGitHubUser() {
    try {
      const githubUser = await this.githubuserService.getGitHubUser(); // Obtener datos del usuario de GitHub
      console.log('Datos del usuario de GitHub:', githubUser); // Mostrar los datos en la consola
    } catch (err) {
      console.error('Error al obtener datos de GitHub:', err);
    }
  }
}