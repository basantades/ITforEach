import { Component, inject, Input } from '@angular/core';
import { User } from '../../../interfaces/user';
import { Project } from '../../../interfaces/project';
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component";
import { ProjectsService } from '../../../services/database/projects.service';

@Component({
  selector: 'app-owner-preview-card',
  standalone: true,
  templateUrl: './owner-preview-card.component.html',
  imports: [UserAvatarComponent]
})
export class OwnerPreviewCardComponent {
  @Input() user!: User;
  @Input() lastProject!: Project;
  @Input() projectCount: number = 0;
  @Input() animationDelay = 0;

  projectsService = inject(ProjectsService);
}
