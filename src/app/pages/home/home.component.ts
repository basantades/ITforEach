import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AuroraBgComponent } from "../../components/blocks/aurora-bg/aurora-bg.component";
import { BackgroundVideoComponent } from "../../components/blocks/background-video/background-video.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ AuroraBgComponent, BackgroundVideoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);
  user = this.authService.userSignal; // Usar el signal del usuario desde AuthService
}