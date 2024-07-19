import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryResponse} from "../../../model/category-response";
import {catchError, finalize, tap, throwError} from "rxjs";
import {LoadingService} from "../../../service/loading.service";
import {AdminService} from "../../../service/admin.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../service/user.service";
import {ProductResponse} from "../../../model/product-response";

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {

  public formUpdate!: FormGroup
  public categories: CategoryResponse[] = [];
  public product: ProductResponse = {}
  public file: File | null = null;
  public imagePreviews: string[] = [];

  constructor(private fb: FormBuilder,
              private loadingService: LoadingService,
              private adminService: AdminService,
              private activatedRouter: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getCategories();
    this.getProduct();
  }

  private buildForm() {
    this.formUpdate = this.fb.group(
      {
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        image: new FormControl(''),
        quantity: new FormControl('', [Validators.required]),
        price: new FormControl('', [Validators.required]),
        categoryId: new FormControl('', [Validators.required])
      }
    )
  }

  updateProduct() {
    if (this.formUpdate.invalid) {
      this.formUpdate.markAllAsTouched();
      return;
    }
  }

  getCategories() {
    this.loadingService.show();
    return this.adminService.getCategories().pipe(
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

  getProduct() {
    this.loadingService.show();
    this.activatedRouter.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.userService.getProduct(id).pipe(
          tap(res => {
            this.product = res;
            this.patchValue();
          }),
          catchError(err => {
            return throwError(err);
          }),
          finalize(() => {
            this.loadingService.hide();
          })
        ).subscribe();
      }
    })
  }

  private patchValue() {
    this.formUpdate.patchValue({
      name: this.product.name,
      quantity: this.product.quantity,
      description: this.product.description,
      price: this.product.price,
      categoryId: this.product.category?.id
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formUpdate.controls;
  }

  handleFileInput(event: any) {
    this.file = (event.target).files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(this.file);
    }
  }
}
