import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/database/user.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  imports: [ NgOptimizedImage ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})

export class UserAvatarComponent implements OnInit {
  @Input() githubusername!: string; // Recibe el username como parámetro
  avatarUrl: string = 'assets/default-avatar.png'; // Imagen por defecto

  constructor(private userService: UserService) {}

  async ngOnInit() {
    if (this.githubusername) {
      const user = await this.userService.getUserByUsername(this.githubusername);
      this.avatarUrl = user?.avatarurl || this.avatarUrl; // Actualiza el avatar si existe
    }
  }
}