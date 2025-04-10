import { Routes } from '@angular/router';
import { AuthGuard } from './guards-resolvers/auth.guard';
import { OwnerGuard } from './guards-resolvers/owner.guard';
import { UserResolver } from './guards-resolvers/user.resolver';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectInfoComponent } from './pages/project-page/project-page.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { MyProjectsComponent } from './pages/my-projects/my-projects.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { NewProjectV2Component } from './pages/new-project-v2/new-project-v2.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'about', component: AboutComponent },
    {
      path: ':githubusername/:projectName/edit',
      component: EditProjectComponent,
      canActivate: [AuthGuard, OwnerGuard], // solo propietario
      resolve: { user: UserResolver } // Obtiene el usuario antes de cargar la página
    },
  {
    path: 'my-projects/:githubusername',
    component: MyProjectsComponent,
    canActivate: [AuthGuard, OwnerGuard], // solo usuarios autenticados
    resolve: { user: UserResolver } // 🔥 Obtiene el usuario antes de cargar la página
  },
  {
    path: 'new-project/:githubusername',
    component: NewProjectV2Component,
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
