import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/database/user.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './user-avatar.component.html'
})
export class UserAvatarComponent implements OnChanges {
  @Input() githubusername!: string;
  @Input() size: number = 240;

  avatarUrl: string = '/assets/img/default-bg-avatar.webp';

  constructor(private userService: UserService) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['githubusername'] && this.githubusername) {
      const user = await this.userService.getUserByUsername(this.githubusername);
      const baseUrl = user?.avatarurl;
      this.avatarUrl = baseUrl ? `${baseUrl}&s=${this.size}` : '/assets/img/default-bg-avatar.webp';
    }
  }
}
