import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { DeleteProjectButtonComponent } from "./delete-project-button/delete-project-button.component";

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css'],
  imports: [DeleteProjectButtonComponent]
})
export class UserProjectsComponent implements OnInit {
  userProjects: any[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.loadUserProjects();
  }

  loadUserProjects(): void {
    this.projectsService.getUserProjects().then(
      (projects) => {
        this.userProjects = projects;
      }
    ).catch(
      (error) => {
        console.error('Error fetching user projects', error);
      }
    );
  }

  // Add this method to handle the projectDeleted event
onProjectDeleted(projectId: string): void {
  // Implement logic to handle project deletion
  console.log(`Project with ID ${projectId} was deleted.`);
}
}