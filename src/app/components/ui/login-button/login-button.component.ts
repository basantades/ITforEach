import { Component } from '@angular/core';
import { SupabaseService } from '../../../services/auth/supabase.service';

@Component({
  selector: 'app-login-button',
  imports: [],
  templateUrl: './login-button.component.html'
})
export class LoginButtonComponent {
  
  constructor(private supabaseService: SupabaseService) {}

  loginWithGithub() {
    this.supabaseService.loginWithGithub();
  }

}
