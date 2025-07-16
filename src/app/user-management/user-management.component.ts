import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { UserService, User } from './user-management.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  imports: [SidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  searchControl = new FormControl('');
  roleFilter = new FormControl('ALL');
  availableRoles: string[] = ['ALL', 'ADMIN', 'AUDITOR'];
  loginRoles: string = '';

  users: User[] = [];
  displayedUsers: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  userForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loginRoles = JSON.parse(localStorage.getItem('roles') || '[]');     
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.loadUsers();

    this.roleFilter.valueChanges.subscribe(() => this.resetToFirstPageAndReload());
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.resetToFirstPageAndReload());
  }

  resetToFirstPageAndReload(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  loadUsers(): void {
  const search = this.searchControl.value?.toLowerCase() || '';
  const selectedRole = this.roleFilter.value;
  const page = this.currentPage - 1;

  // Jangan kirim filter role ke backend — ambil semua dulu
  this.userService.getUsersPageable(page, this.pageSize, search).subscribe({
    next: (res) => {
      this.users = res.data.map((user: any) => ({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles : user.roles ? [user.roles] : []
      }));
      this.displayedUsers = this.users.filter(user => {
        const matchRole =
            selectedRole === 'ALL' ||
            !selectedRole ||
            (Array.isArray(user.roles) && user.roles.includes(selectedRole));

        const matchSearch = user.name.toLowerCase().includes(search);
        return matchRole && matchSearch;
      });

      this.totalPages = res.totalPages;
    },
    error: (err) => {
      Swal.fire({
        title: 'Error!',
        text: err.error?.error || 'Gagal memuat data user.',
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
        this.loadUsers();
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

  onGoRegister(): void {
    this.route.navigate(['/user-register']);
  }

  getPaginationRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return { start, end };
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  formatRoles(roles: string[] | undefined): string {
  return roles && roles.length > 0 ? roles.join(', ') : '-';
  }



}
