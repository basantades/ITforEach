import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../interfaces/project';
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component";
import { LikeButtonComponent } from "../../ui/like-button/like-button.component";
import { WebsiteLinkIconComponent } from "../../ui/website-link-icon/website-link-icon.component";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink, UserAvatarComponent, LikeButtonComponent, WebsiteLinkIconComponent, NgOptimizedImage],
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() animationDelay = 0;

  transformImageUrl(url: string, width: number) {
    // Lógica simplificada si no quieres inyectar el servicio entero
    return url.replace('/upload/', `/upload/w_${width}/`);
  }
}
