import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService, private router: Router) {}
  isLoggedIn = false;
  private userSub: Subscription;

  ngOnInit() {
    this.userSub = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
