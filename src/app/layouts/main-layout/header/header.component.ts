import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase/supabase.service';
import { LoginButtonComponent } from "../../../components/ui/login-button/login-button.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private supabase = inject(SupabaseService);
  user = this.supabase.user; 

  logout() {
    this.supabase.logout();
  }
}
