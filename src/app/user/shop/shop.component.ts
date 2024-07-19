import {Component, OnInit} from '@angular/core';
import {catchError, finalize, tap, throwError} from "rxjs";
import {LoadingService} from "../../service/loading.service";
import {UserService} from "../../service/user.service";
import {CategoryResponse} from "../../model/category-response";
import {ProductResponse} from "../../model/product-response";
import {AlertService} from "../../service/alert.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  public categories: CategoryResponse[] = [];
  public products: ProductResponse[] = [];
  pageIndex = 0;
  page = 1;
  totalElements: number = 0;
  pageSize: number = 6;
  limit = 150;

  constructor(private loadingService: LoadingService,
              private userService: UserService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts(0, '');
  }

  addCart(productId: string,event:Event) {
    event.stopPropagation();
    this.loadingService.show();
    const request = {
      productId: productId
    }
    return this.userService.addCart(request).pipe(
      tap(() => {
        this.alertService.alertSuccess('Thêm vào giỏ hàng thành công')
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  handlePageChange(page: number) {
    this.page = page - 1;
    this.getProducts(this.page, '');
  }

  onSelectChange(event: any): void {
    this.getProducts(0, event?.target?.value);
  }

  getTruncatedDescription(description: any): string {
    if (!description) return '';
    if (description.length > this.limit) {
      return description.slice(0, this.limit) + '...';
    }
    return description;
  }

  getProducts(page: number, categoryId: string | undefined) {
    console.log('categoryId: ', categoryId)
    this.loadingService.show();
    return this.userService.getProducts('', categoryId, page, this.pageSize).pipe(
      tap(res => {
        this.products = res?.products || [];
        this.totalElements = res.totalElements || 0;
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  getCategories() {
    this.loadingService.show();
    return this.userService.getCategories(true).pipe(
      tap(res => {
        this.categories = res?.categories || [];
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

}
