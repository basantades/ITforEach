import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AuroraBgComponent } from "../../components/blocks/aurora-bg/aurora-bg.component";
import { LatestProjectsComponent } from "../../components/blocks/latest-projects/latest-projects.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AuroraBgComponent, LatestProjectsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}