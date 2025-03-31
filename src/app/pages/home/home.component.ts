import { Component, Signal, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { LoginButtonComponent } from "../../components/ui/login-button/login-button.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, LoginButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private supabase = inject(SupabaseService);
  user = this.supabase.user; 
  
}
