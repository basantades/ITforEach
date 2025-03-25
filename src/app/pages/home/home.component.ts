import { Component, Signal, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private supabase = inject(SupabaseService);
  user = signal<User | null>(null);

  constructor() {
    this.loadUser();
  }

  async loadUser() {
    const session = await this.supabase.getSession();
    if (session.data.session) {
      const userMetadata = session.data.session.user.user_metadata;
      this.user.set({
        id: session.data.session.user.id,
        githubUsername: userMetadata["user_name"],
        fullName: userMetadata["full_name"],
        avatarUrl: userMetadata["avatar_url"],
        email: session.data.session.user.email ?? ''
      });
    }
  }
}
