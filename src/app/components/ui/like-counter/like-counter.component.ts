import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikesService } from '../../../services/database/likes.service';

@Component({
  selector: 'app-like-counter',
  standalone: true,
  imports: [CommonModule],
  template: `{{ likesCount() }}`
})
export class LikeCounterComponent implements OnInit {
  @Input() projectId!: number;
  likesCount = signal(0);

  constructor(private likesService: LikesService) {}

  async ngOnInit() {
    const count = await this.likesService.getLikesCount(this.projectId);
    this.likesCount.set(count);
  }
}
