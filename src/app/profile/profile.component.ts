import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../user-management/user-management.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user : any;
  userName : any = '';

  constructor(private userService: UserService){

  }

  ngOnInit(): void {
    // this.getUserbyUserName();
    console.log(localStorage.getItem('userName'));
  }

  getUserbyUserName(){
    this.userName = localStorage.getItem('userName');
    console.log(this.userName);
    
    this.userService.getUsersbyUsername(this.userName).subscribe({
      next: (res) => {
        this.user = res;
        console.log(res);
      },
      error: (err) => {
        alert(err.errorMessage);
      }
    })
  }

  }
