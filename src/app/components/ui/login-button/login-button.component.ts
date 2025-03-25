import { Component } from '@angular/core';
import { SupabaseService } from '../../../services/supabase/supabase.service';

@Component({
  selector: 'app-login-button',
  imports: [],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  
  constructor(private supabaseService: SupabaseService) {}

  loginWithGithub() {
    this.supabaseService.signInWithGithub()
      .then(({ data, error }) => {
        if (error) console.error('Error en login:', error);
        else console.log('Redirigiendo a GitHub...');
      });
}

}
