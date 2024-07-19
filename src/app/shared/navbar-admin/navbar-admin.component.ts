import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  isFixedTop: boolean = true; // Mặc định giữ nguyên class fixed-top

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isFixedTop = !this.router.url.startsWith('/admin');
      }
    });
  }

  ngOnInit(): void {
  }
}
