import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.css']
})
export class LayoutAdminComponent implements OnInit {

  active$ = new BehaviorSubject<string>('');
  activeItem: string = '';

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.setActiveItemNavbar();
  }

  setActiveItem(item: string): void {
    this.activeItem = item
  }

  setActive(item: string): void {
    this.activeItem = ''
    this.active$.next(item);
    console.log(this.active$.value)
  }

  private setActiveItemNavbar() {
    const url = this.router.url;
    if (url) {
      switch (url) {
        case '/admin/users':
          this.active$.next('users-management')
          this.activeItem = 'users'
          break;
        case '/admin/products':
          this.active$.next('product-management')
          this.activeItem = 'products'
          break;
        case '/admin/product/create':
          this.active$.next('product-management')
          this.activeItem = 'product-create'
          break;
        case '/admin/categories':
          this.active$.next('product-management')
          this.activeItem = 'categories'
          break;
        case '/admin/category/create':
          this.active$.next('product-management')
          this.activeItem = 'category-create'
          break;
      }
    }
  }

}
