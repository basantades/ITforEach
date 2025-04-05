import { Component, Input, Signal, inject, effect, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/database/user.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  @Input() userSignal!: Signal<User | null>; // Recibe el signal del padre
  @Output() profileUpdated = new EventEmitter<void>(); // 🔥 Emite evento al actualizar
  profileForm: FormGroup;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor() {
    this.profileForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      bio: [''],
      sociallinks: this.fb.array([]),
      website: ['']
    });

    // 🚀 Efecto Reactivo para actualizar el formulario al cambiar el usuario
    effect(() => {
      const user = this.userSignal();
      if (user) {
        this.loadUserData(user);
      }
    });
  }

  /** Cargar datos del usuario en el formulario */
  private loadUserData(user: User) {
    this.profileForm.patchValue({
      fullname: user.fullname,
      email: user.email || '',
      bio: user.bio || '',
      website: user.website || ''
    });

    // Llenar el FormArray de redes sociales
    this.profileForm.setControl(
      'sociallinks',
      this.fb.array((Array.isArray(user.sociallinks) ? user.sociallinks : []).map(link => this.fb.control(link || '')))
    );
  }

  /** Obtiene el FormArray de social links */
  get socialLinks(): FormArray {
    return this.profileForm.get('sociallinks') as FormArray;
  }

  addSocialLink() {
    if (this.socialLinks.length < 10) {
      this.socialLinks.push(this.fb.control(''));
    }
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  async saveProfile() {
    if (this.profileForm.invalid) return;

    const user = this.userSignal();
    if (!user) {
      console.error('❌ No hay usuario para actualizar.');
      return;
    }

    const updatedUser: Partial<User> = {
      ...this.profileForm.value,
      sociallinks: this.socialLinks.value.filter((link: string) => link.trim() !== '') // Limpia links vacíos
    };

    try {
      await this.userService.updateUser(user.user_id, updatedUser);
      this.profileUpdated.emit(); // 🔥 Notificamos al padre que se ha actualizado el perfil
    } catch (error) {
      console.error('❌ Error al actualizar el perfil:', error);
    }
  }
}
