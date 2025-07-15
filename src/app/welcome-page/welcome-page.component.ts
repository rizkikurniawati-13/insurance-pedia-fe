import { Component, AfterViewInit  } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-welcome-page',
  imports: [SafePipe, CommonModule, SidebarComponent],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {

  youtubeUrl = 'https://www.youtube.com/embed/iWHatVhmDOY?autoplay=1&mute=1&rel=0&controls=1';
}
