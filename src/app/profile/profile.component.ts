import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  imports: [SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = {
    name: 'Rizki Kurniawati',
    email: 'rizki@example.com',
    role: 'IT Business Analyst',
    joined: '2020-05-10',
    bio: 'The best life is a life that gives meaning to others.'
  };
}
