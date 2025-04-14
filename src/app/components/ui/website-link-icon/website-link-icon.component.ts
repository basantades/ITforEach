import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-website-link-icon',
  standalone: true,
  templateUrl: './website-link-icon.component.html'
})
export class WebsiteLinkIconComponent {
  @Input() url: string | null | undefined = null;
}
