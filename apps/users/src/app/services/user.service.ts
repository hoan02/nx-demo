import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '@nx-demo/libs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.API_URL + 'users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-username`, {
      params: { username },
    });
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email`, {
      params: { email },
    });
  }
}
