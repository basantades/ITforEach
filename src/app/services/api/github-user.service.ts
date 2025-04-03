import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GithubUserService {
  constructor(private authService: AuthService) {}

  // Obtener datos del usuario de GitHub
  async getGitHubUser(): Promise<any> {
    const token = this.authService.getGitHubToken(); // Obtener el token desde AuthService
    if (!token) {
      console.error('❌ No se encontró un token de GitHub.');
      throw new Error('GitHub token not found');
    }

    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error (user):', errorData);
      throw new Error(`Failed to fetch GitHub user: ${errorData.message}`);
    }

    const userData = await response.json();
    console.log('GitHub User Data:', userData); // 🔍 Mostrar los datos obtenidos
    return userData;
  }
}