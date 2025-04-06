import { Routes } from '@angular/router';
import { AuthGuard } from './guards-resolvers/auth.guard';
import { OwnerGuard } from './guards-resolvers/owner.guard';
import { UserResolver } from './guards-resolvers/user.resolver';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectInfoComponent } from './pages/project-page/project-page.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { MyProjectsComponent } from './pages/my-projects/my-projects.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'discover', component: DiscoverComponent },
  {
    path: 'my-projects/:githubusername',
    component: MyProjectsComponent,
    canActivate: [AuthGuard, OwnerGuard], // solo usuarios autenticados
    resolve: { user: UserResolver } // 🔥 Obtiene el usuario antes de cargar la página
  },
  {
    path: 'new-project/:githubusername',
    component: NewProjectComponent,
    canActivate: [AuthGuard, OwnerGuard], 
    resolve: { user: UserResolver } 
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
