import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
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
}