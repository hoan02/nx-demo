import { ApiService } from '@nx-demo/core/http-client';
import { IUser, UserResponse } from '@nx-demo/core/api-types';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  LoginUser,
  LoginUserRequest,
  NewUserRequest,
  NewUser,
} from '@nx-demo/core/api-types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiService = inject(ApiService);

  user(): Observable<UserResponse> {
    return this.apiService.get<UserResponse>('/user');
  }

  update(user: IUser): Observable<UserResponse> {
    return this.apiService.put('/user', { user });
  }

  login(credentials: LoginUser): Observable<UserResponse> {
    return this.apiService
      .post<UserResponse, LoginUserRequest>('/users/login', {
        user: credentials,
      })
      .pipe(
        tap((response) => {
          const accessToken = response.user.accessToken;
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
          }
        })
      );
  }

  logout(): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }, void>('/users/logout');
  }

  register(credentials: NewUser): Observable<UserResponse> {
    return this.apiService.post<UserResponse, NewUserRequest>('/users', {
      user: credentials,
    });
  }
}
