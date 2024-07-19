import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-profile-layout',
  templateUrl: './my-profile-layout.component.html',
  styleUrls: ['./my-profile-layout.component.css']
})
export class MyProfileLayoutComponent implements OnInit {

  activeItem: string = '';
  active: string = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.setActiveItemNavbar();
  }

  private setActiveItemNavbar() {
    const url = this.router.url;
    if (url) {
      switch (url) {
        case '/my-profile':
          this.active = 'profile'
          this.activeItem = 'profile'
          break;
        case '/my-profile/change-password':
          this.active = 'profile'
          this.activeItem = 'change-password'
          break;
      }
    }
  }

  setActiveItem(item: string): void {
    this.activeItem = item;
  }

  setActive(item: string): void {
    this.active = item;
  }

}
