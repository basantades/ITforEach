import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {
  @Input() text: string | null = null; // Parámetro opcional para el texto

  constructor(private location: Location) {}

  isHome(): boolean {
    return this.location.path() === '/';
  }

  goBack(): void {
    this.location.back();
  }
}