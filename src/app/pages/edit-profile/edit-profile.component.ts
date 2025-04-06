import {
  Component,
  effect
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/database/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullname: [''],
      email: ['', [Validators.email]],
      bio: [''],
      website: [''],
      linkedin: [''],
    });

    effect(() => {
      const authUser = this.authService.userSignal();
      if (authUser?.githubusername) {
        this.loadUserData(authUser.githubusername);
      }
    });
  }

  /** Cargar datos del usuario desde UserService */
  private async loadUserData(githubusername: string) {
    const user = await this.userService.getUserByUsername(githubusername);
    if (!user) return;

    this.profileForm.patchValue({
      fullname: user.fullname,
      email: user.email || '',
      bio: user.bio || '',
      website: user.website || '',
      linkedin: user.linkedin || ''
    });
  }

  /** Guardar cambios del perfil */
  async saveProfile() {
    if (this.profileForm.invalid) return;

    const authUser = this.authService.userSignal();
    if (!authUser) {
      console.error('❌ No hay usuario autenticado.');
      return;
    }

    const updatedUser: Partial<User> = {
      ...this.profileForm.value
    };

    try {
      await this.userService.updateUser(authUser.user_id, updatedUser);
      this.toastr.success('Perfil actualizado correctamente', 'Guardado');
      setTimeout(() => {
        this.router.navigate([`/${authUser.githubusername}`]);
      }, 1000);
    } catch (error) {
      console.error('❌ Error al actualizar el perfil:', error);
      this.toastr.error('Hubo un error al guardar los cambios', 'Error');
    }
  }
}
