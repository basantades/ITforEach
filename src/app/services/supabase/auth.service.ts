import { Injectable, signal } from '@angular/core';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSignal = signal<User | null>(null); // Usuario autenticado
  isOwnerSignal = signal(false); // Indica si el usuario autenticado es el propietario

  // Método para establecer el usuario autenticado
  setUser(user: User | null, githubusernameFromUrl?: string) {
    this.userSignal.set(user);

    // Actualizar isOwner si se proporciona un username desde la URL
    if (user && githubusernameFromUrl) {
      this.isOwnerSignal.set(user.githubusername === githubusernameFromUrl);
    } else {
      this.isOwnerSignal.set(false);
    }
  }

  // Método para cerrar sesión
  logout() {
    this.userSignal.set(null); // Limpia el estado del usuario autenticado
    this.isOwnerSignal.set(false); // Restablece isOwner
  }
}