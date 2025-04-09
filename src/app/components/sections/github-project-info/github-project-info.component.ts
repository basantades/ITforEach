
import { Project } from '../../../interfaces/project';
import { Component, Input, signal, computed, effect, Signal } from '@angular/core';


@Component({
  selector: 'app-github-project-info',
  templateUrl: './github-project-info.component.html'
})
export class GithubProjectInfoComponent {
  private _project = signal<Project | null>(null);

  @Input({ required: true })
  set project(value: Project | null) {
    this._project.set(value);
  }

  get project(): Signal<Project | null> {
    return this._project.asReadonly();
  }
}
