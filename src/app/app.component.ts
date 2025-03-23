import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  
  constructor(private supabaseService: SupabaseService) {}

  loginWithGithub() {
    this.supabaseService.signInWithGithub()
      .then(({ data, error }) => {
        if (error) console.error('Error en login:', error);
        else console.log('Redirigiendo a GitHub...');
      });
  }




  title = 'ITforEach';
}

