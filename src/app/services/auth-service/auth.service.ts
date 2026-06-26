import { Injectable } from '@angular/core';
import { User } from '../../models/auth-models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthStatus } from '../../types/auth-status';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(user: User){
    return this.http.post(
      `${this.apiUrl}/auth/login`,
      {
        userName: user.username,
        password: user.password
      },
      { withCredentials: true }
    );
  }

  status() {
    return this.http.get<AuthStatus>(`${this.apiUrl}/auth/status`, {
      withCredentials: true
    });
  }

  logout(){
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  register(){}

  forgotPassword(){}

  resetPassword(){}

  refreshToken(){
    return this.http.post(
      `${this.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  verifyEmail(){}
}
