import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-github-link-button',
  standalone: true,
  templateUrl: './github-link-button.component.html'
})
export class GithubLinkButtonComponent {
  @Input() url: string | null | undefined = null;}