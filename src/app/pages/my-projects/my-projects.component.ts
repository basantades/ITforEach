import { Component } from '@angular/core';
import { UserProjectsListComponent } from './user-projects-list/user-projects-list.component';

@Component({
  selector: 'app-my-projects',
  imports: [UserProjectsListComponent],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.scss'
})
export class MyProjectsComponent {

}
