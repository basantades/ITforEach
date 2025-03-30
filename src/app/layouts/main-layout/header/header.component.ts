import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginButtonComponent } from "../../../components/ui/login-button/login-button.component";
import { User } from '../../../interfaces/user';
import { SupabaseService } from '../../../services/supabase/supabase.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LoginButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
