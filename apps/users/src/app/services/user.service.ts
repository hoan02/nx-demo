import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserTable } from '@nx-demo/core/api-types';
import { ApiService } from '@nx-demo/core/http-client';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private prefixUrl = '/users';

  private readonly apiService = inject(ApiService);

  getUsers(pageNumber: number, pageSize: number): Observable<IUserTable> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageSize.toString());
    return this.apiService.get<IUserTable>(this.prefixUrl, params);
  }

  getUserById(id: string): Observable<IUser> {
    return this.apiService.get<IUser>(`${this.prefixUrl}/${id}`);
  }

  createUser(user: IUser): Observable<IUser> {
    return this.apiService.post<IUser, IUser>(this.prefixUrl, user);
  }

  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.apiService.put<IUser, IUser>(`${this.prefixUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.prefixUrl}/${id}`);
  }

  checkUsername(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.apiService.get<boolean>(
      `${this.prefixUrl}/check-username`,
      params
    );
  }

  checkEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.apiService.get<boolean>(
      `${this.prefixUrl}/check-email`,
      params
    );
  }
}
