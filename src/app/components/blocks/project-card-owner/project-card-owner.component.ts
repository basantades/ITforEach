import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../interfaces/project';
import { LikeButtonComponent } from "../../ui/like-button/like-button.component";
import { WebsiteLinkIconComponent } from "../../ui/website-link-icon/website-link-icon.component";
import { NgOptimizedImage } from '@angular/common';
import { ProjectsService } from '../../../services/database/projects.service';
import { GithubLinkIconComponent } from "../../ui/github-link-icon/github-link-icon.component";

@Component({
  selector: 'app-project-card-owner',
  standalone: true,
  imports: [CommonModule, RouterLink, LikeButtonComponent, WebsiteLinkIconComponent, NgOptimizedImage, GithubLinkIconComponent],
  templateUrl: './project-card-owner.component.html',
})
export class ProjectCardOwnerComponent {
  @Input() project!: Project;
  @Input() animationDelay = 0;
  projectsService = inject(ProjectsService);

}
