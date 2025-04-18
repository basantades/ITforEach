import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/database/user.service';
import { ProjectsService } from '../../services/database/projects.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { Project } from '../../interfaces/project';
import { CommonModule } from '@angular/common';
import { OwnerPreviewCardComponent } from '../../components/blocks/owner-preview-card/owner-preview-card.component';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../../components/ui/loading/loading.component";

@Component({
  selector: 'app-owners-page',
  standalone: true,
  imports: [CommonModule, OwnerPreviewCardComponent, RouterLink, LoadingComponent],
  templateUrl: './owners.component.html',
})
export class OwnersPageComponent implements OnInit {
  private userService = inject(UserService);
  private projectsService = inject(ProjectsService);
  private authService = inject(AuthService);
  

  owners = signal<{ user: User; lastProject: Project; projectCount: number }[]>([]);
  isLoading = signal(true);
  hasProjects = signal(true); // para el aviso

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      const users = await this.userService.getAllUsers(); // asumimos que tienes este método
      const ownerList: { user: User; lastProject: Project; projectCount: number }[] = [];
      for (const user of users) {
        const projects = await this.projectsService.getUserProjects(user.githubusername);
      
        // 🔍 Verifica si es el usuario autenticado
        if (this.authService.userSignal()?.user_id === user.user_id && projects.length === 0) {
          this.hasProjects.set(false); // ✅ Ahora sí se ejecuta correctamente
        }
      
        if (projects.length > 0) {
          ownerList.push({
            user,
            lastProject: projects[0],
            projectCount: projects.length
          });
        }
      }

      this.owners.set(ownerList);
    } catch (error) {
      console.error('❌ Error cargando usuarios con proyectos', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  user = computed(() => this.authService.userSignal());
}
