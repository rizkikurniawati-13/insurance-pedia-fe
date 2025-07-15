import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'

})
export class SidebarComponent {
  isSidebarOpen = false;
  isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  menus = [
    { label: 'Welcome', icon: 'fa-regular fa-face-smile-beam', link: '/welcome' },
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
    { label: 'Business Process', icon: 'fa-solid fa-bars-staggered', link: '/business-process' },
    { label: 'Glossarium', icon: 'fa-solid fa-layer-group', link: '/glossary' },
    { label: 'Insurance Companies', icon: 'fa-solid fa-city', link: '/insurance-companies' },
    { label: 'Regulation', icon: 'fa-solid fa-folder-open', link: '/regulations' },
    { label: 'Audit Cases', icon: 'fa-solid fa-book-journal-whills', link: '/audit-case' },
    { label: 'Games', icon: 'fa-solid fa-gamepad', link: '/crossword' },
    { label: 'FAQ', icon: 'fa-solid fa-circle-question', link: '/faq-list' },
    { label: 'User Management', icon: 'fa-solid fa-users', link: '/user-management' },
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.collapsedChange.emit(this.isSidebarOpen);
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    // Simpan status collapse ke localStorage jika ingin persist
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
