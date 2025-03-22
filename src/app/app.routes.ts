import { Routes } from '@angular/router';
import { UserPageComponent } from './pages/user-page/user-page.component';

export const routes: Routes = [

    // { path: '', component: HomeComponent },
    { path: 'user', component: UserPageComponent },
    { path: '**', redirectTo: '' } 

];
