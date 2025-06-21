import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { UserService, User } from './user-management.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  imports: [SidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  Math = Math;
  users: User[] = [];
  userForm!: FormGroup;
  filteredUsers: User[] = []; // Users after applying role filter
  displayedUsers: User[] = []; // Users for current page
  roleFilter = new FormControl(''); // FormControl for role filter
  availableRoles: string[] = ['ALL', 'ADMIN', 'AUDITOR']; // Roles for filter dropdown
  currentPage: number = 1;
  pageSize: number = 10; // Number of users per page
  totalPages: number = 1;

  constructor(private userService: UserService, private fb: FormBuilder, private route: Router) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.loadUsers();
    this.roleFilter.valueChanges.subscribe((role) => {
      this.applyFilterAndPagination();
    });
  }

  loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: (users) => {
      this.users = users.map(user => {
        console.log('Processing user:', { id: user.id, name: user.name, email: user.email, role: user.role });
        return {
          ...user,
          role: Array.isArray(user.role) ? user.role : user.role ? [user.role] : ['AUDITOR']
        };
      });
      this.applyFilterAndPagination();
    },
    error: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error.error?.error || 'Failed to load users.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}


  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'User deleted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.loadUsers(); // Refresh user list
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: error.error?.error || 'Failed to delete user.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onGoRegister(){
    this.route.navigate(['/user-register'])

  }

  applyFilterAndPagination(): void {
  const selectedRole = this.roleFilter.value;
  this.filteredUsers = selectedRole === 'ALL' || !selectedRole
    ? this.users
    : this.users.filter(user => {
        if (!user.role) return false; // Exclude users with undefined/null roles
        return Array.isArray(user.role)
          ? user.role.includes(selectedRole)
          : user.role === selectedRole;
      });

  this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  // New method to get pagination range
  getPaginationRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.filteredUsers.length);
    return { start, end };
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilterAndPagination();
    }
  }

  formatRoles(role: string | string[] | undefined, user?: User): string {
  if (Array.isArray(role)) {
    return role.join(', ').toLowerCase();
  }
  return role ? role.toLowerCase() : '-';
  }
}
