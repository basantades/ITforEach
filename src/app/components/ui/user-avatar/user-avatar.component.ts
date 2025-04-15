import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/database/user.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent implements OnChanges {
  @Input() githubusername!: string;
  avatarUrl: string = '/assets/img/default-bg-avatar.webp';

  constructor(private userService: UserService) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['githubusername'] && this.githubusername) {
      const user = await this.userService.getUserByUsername(this.githubusername);
      this.avatarUrl = user?.avatarurl || '/assets/img/default-bg-avatar.webp';
    }
  }
}
