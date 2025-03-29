import { Routes } from '@angular/router';
import { ProjectsPageComponent } from './pages/projects/projects.component';
import { AuthGuard } from './guards-resolvers/auth.guard';
import { UserResolver } from './guards-resolvers/user.resolver';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectInfoComponent } from './pages/projects/project-info/project-info.component';
import { DiscoverComponent } from './pages/discover/discover.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', component: UserPageComponent },
    { path: 'discover', component: DiscoverComponent },

  {
    path: 'projects/:githubUsername',
    component: ProjectsPageComponent,
    canActivate: [AuthGuard], // 🔥 Protege la ruta, solo usuarios autenticados
    resolve: { user: UserResolver } // 🔥 Obtiene el usuario autenticado antes de cargar la página
  },
  { path: ':githubUsername/:projectName', component: ProjectInfoComponent},

  { path: '**', redirectTo: '' } // Redirige cualquier otra ruta a la raíz
];
