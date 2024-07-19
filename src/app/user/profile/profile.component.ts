import {Component, OnInit} from '@angular/core';
import {UserResponse} from "../../model/user-response";
import {catchError, delay, finalize, tap, throwError, timeout} from "rxjs";
import {UserService} from "../../service/user.service";
import {LoadingService} from "../../service/loading.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserResponse = {}

  constructor(private userService: UserService,
              private loading: LoadingService) {
  }

  ngOnInit(): void {
    this.getMyProfile();
  }

  getMyProfile() {
    this.loading.show();
    return this.userService.myProfile().pipe(
      tap(res => {
        this.user = res;
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading.hide();
      })
    ).subscribe()
  }
}
