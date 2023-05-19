import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser = {} as User;

  toggle: boolean = false;

  @Output() toggleEvent = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.toggle = JSON.parse(localStorage.getItem('sidebar') || 'false');
    this.toggleEvent.emit(this.toggle);
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getUser().subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  toggleSidebarEvent() {
    this.toggle = !this.toggle;
    localStorage.setItem('sidebar', JSON.stringify(this.toggle));
    let sidebar = JSON.parse(localStorage.getItem('sidebar') || 'false');
    this.toggleEvent.emit(sidebar);
  }

  logout() {
    this.authService.logout().subscribe((res: any) => {
      if (res.status === 'success') {
        this.router.navigate(['/auth/login']);
      } else {
        this.logout();
      }
    });
  }
}
