import { Routes } from '@angular/router';
import { ProjectsPageComponent } from './pages/projects/projects.component';
import { AuthGuard } from './guards-resolvers/auth.guard';
import { OwnerGuard } from './guards-resolvers/owner.guard';
import { UserResolver } from './guards-resolvers/user.resolver';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectInfoComponent } from './pages/project-page/project-page.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'discover', component: DiscoverComponent },

  {
    path: 'projects/:githubusername',
    component: ProjectsPageComponent,
    canActivate: [AuthGuard, OwnerGuard], // solo usuarios autenticados
    resolve: { user: UserResolver } // 🔥 Obtiene el usuario antes de cargar la página
  },
  {
  path: 'edit-profile/:githubusername',
  component: EditProfileComponent,
  canActivate: [AuthGuard, OwnerGuard], // solo propietario
  resolve: { user: UserResolver } // Obtiene el usuario antes de cargar la página
},
{ path: ':githubusername/:projectName', component: ProjectInfoComponent},

  { path: ':githubusername', component: UserPageComponent },

  { path: '**', redirectTo: '' } // Redirige cualquier otra ruta a la raíz
];
