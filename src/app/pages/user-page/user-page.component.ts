import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-page',
  imports: [],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    try {
      this.user = await this.userService.getUserProfile();
      if (!this.user) {
        this.error = 'No se pudo cargar el usuario';
      }
    } catch (err) {
      console.error(err);
      this.error = 'Error al cargar el perfil';
    } finally {
      this.loading = false;
    }
  }
}