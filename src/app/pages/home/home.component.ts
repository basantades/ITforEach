import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AuroraBgComponent } from "../../components/blocks/aurora-bg/aurora-bg.component";
import { LatestProjectsComponent } from "../../components/sections/latest-projects/latest-projects.component";
import { DiscordBannerComponent } from "../../components/blocks/discord-banner/discord-banner.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AuroraBgComponent, LatestProjectsComponent, DiscordBannerComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}