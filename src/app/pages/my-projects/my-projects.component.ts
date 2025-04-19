import { Component } from '@angular/core';
import { UserProjectsListComponent } from '../../components/sections/user-projects-list/user-projects-list.component';

@Component({
  selector: 'app-my-projects',
  imports: [UserProjectsListComponent],
  templateUrl: './my-projects.component.html'
})
export class MyProjectsComponent {

}
