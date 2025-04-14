import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-website-link-button',
  standalone: true,
  templateUrl: './website-link-button.component.html'
})
export class WebsiteLinkButtonComponent {
  @Input() url: string | null | undefined = null;
}
