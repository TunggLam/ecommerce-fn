import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, finalize, tap, throwError} from "rxjs";
import {CategoryResponse} from "../../../model/category-response";
import {LoadingService} from "../../../service/loading.service";
import {AdminService} from "../../../service/admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  categoryName: string = '';
  formCreate!: FormGroup;
  public categories: CategoryResponse[] = [];
  file: File | null = null;
  imagePreviews: string[] = [];

  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formCreate.controls;
  }

  handleFileInput(event: any) {
    this.file = (event.target).files[0];
    if (this.file){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(this.file);
    }
  }

  initForm() {
    this.formCreate = this.fb.group(
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


  createProduct() {
    if (this.formCreate.invalid) {
      this.formCreate.markAllAsTouched();
      return;
    }
    this.loadingService.show();
    const formData = new FormData();
    formData.append('name', this.formCreate.get('name')?.value)
    formData.append('categoryId', this.formCreate.get('categoryId')?.value)
    formData.append('quantity', this.formCreate.get('quantity')?.value)
    formData.append('price', this.formCreate.get('price')?.value)
    formData.append('description', this.formCreate.get('description')?.value)
    if (this.file) {
      formData.append('image', this.file)
    }

    return this.adminService.createProduct(formData).pipe(
      tap(() => {
        this.router.navigateByUrl("/admin/products")
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  getCategories() {
    this.loadingService.show();
    return this.adminService.getCategories().pipe(
      tap(res => {
        this.categories = res?.categories || [];
        this.formCreate.get('categoryId')?.patchValue(this.categories[0].id);
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
