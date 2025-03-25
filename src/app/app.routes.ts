import { Routes } from '@angular/router';
import { ProjectsPageComponent } from './pages/projects/projects.component';
import { AuthGuard } from './guards-resolvers/auth.guard';
import { UserResolver } from './guards-resolvers/user.resolver';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', component: UserPageComponent },
  {
    path: ':githubUsername/projects',
    component: ProjectsPageComponent,
    canActivate: [AuthGuard], // 🔥 Protege la ruta, solo usuarios autenticados
    resolve: { user: UserResolver } // 🔥 Obtiene el usuario autenticado antes de cargar la página
  },
  { path: '**', redirectTo: '' } // Redirige cualquier otra ruta a la raíz
];
