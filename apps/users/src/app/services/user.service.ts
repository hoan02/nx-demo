import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { IUser, IUserTable } from '@nx-demo/core/api-types';
import { ApiService } from '@nx-demo/core/http-client';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.API_URL + 'users';

  private readonly apiService = inject(ApiService);

  getUsers(pageNumber: number, pageSize: number): Observable<IUserTable> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageSize.toString());
    return this.apiService.get<IUserTable>(`${this.apiUrl}`, params);
  }

  getUserById(id: string): Observable<IUser> {
    return this.apiService.get<IUser>(`${this.apiUrl}/${id}`);
  }

  createUser(user: IUser): Observable<IUser> {
    return this.apiService.post<IUser, IUser>(this.apiUrl, user);
  }

  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.apiService.put<IUser, IUser>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkUsername(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.apiService.get<boolean>(
      `${this.apiUrl}/check-username`,
      params
    );
  }

  checkEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.apiService.get<boolean>(`${this.apiUrl}/check-email`, params);
  }
}
