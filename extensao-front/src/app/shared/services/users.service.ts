import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../interfaces/entities/user';
import { ApiResponse } from '../interfaces/apiResponse';
import { CreateUserDTO } from '../interfaces/dto/user/createUser.dto';
import { UpdateUserDTO } from '../interfaces/dto/user/updateUser.dto';
import { ChangePasswordDTO } from '../interfaces/dto/user/changePassword.dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = `${environment.apiUrl}/usuarios`;
  
  getUsers(params?: {
    pagina?: number,
    limite?: number,
    buscar?: string
  }): Observable<ApiResponse> {
    return this._http.get<ApiResponse>(this._baseUrl, { params });
  }

  getUserById(id: number): Observable<User | undefined> {
    return this._http.get<ApiResponse>(`${this._baseUrl}/${id}`)
      .pipe(map(res => res.usuario));
  }
  
  createUser(user: CreateUserDTO): Observable<User | undefined> {
    return this._http.post<ApiResponse>(this._baseUrl, user)
      .pipe(map(res => res.usuario));
  }
  
  updateUser(id: number, user: UpdateUserDTO): Observable<User | undefined> {
    return this._http.patch<ApiResponse>(`${this._baseUrl}/${id}`, user)
      .pipe(map(res => res.usuario));
  }
  
  changePassword(changePassword: ChangePasswordDTO): Observable<ApiResponse> {
    return this._http.patch<ApiResponse>(`${this._baseUrl}/me/senha`, changePassword);
  }
  
  deleteUser(id: number): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this._baseUrl}/${id}`);
  }
}
