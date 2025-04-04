import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { LikesService } from '../../../services/database/likes.service';

@Component({
  selector: 'app-like-button',
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
})
export class LikeButtonComponent implements OnInit {
  @Input() projectId!: number;

  likesCount = signal(0);
  hasLiked = signal(false);


  private authService = inject(AuthService);
  user = this.authService.userSignal;

  constructor(private likesService: LikesService) {}

  async ngOnInit() {
    const [count, liked] = await Promise.all([
      this.likesService.getLikesCount(this.projectId),
      this.likesService.hasUserLiked(this.projectId),
    ]);

    this.likesCount.set(count);
    this.hasLiked.set(liked);
  }

  async toggleLike() {
    if (this.hasLiked()) {
      const removed = await this.likesService.removeLike(this.projectId);
      if (removed) {
        this.likesCount.set(this.likesCount() - 1);
        this.hasLiked.set(false);
      }
    } else {
      const added = await this.likesService.addLike(this.projectId);
      if (added) {
        this.likesCount.set(this.likesCount() + 1);
        this.hasLiked.set(true);
      }
    }
  }
}
