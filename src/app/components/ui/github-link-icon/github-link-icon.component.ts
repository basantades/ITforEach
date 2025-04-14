import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-github-link-icon',
  standalone: true,
  templateUrl: './github-link-icon.component.html'
})
export class GithubLinkIconComponent {
  @Input() url: string | null | undefined = null;
}
