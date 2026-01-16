import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthData } from '../interfaces/requests/authData';
import { ApiResponse } from '../interfaces/apiResponse';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { User } from '../interfaces/entities/user';
import { JwtPayload } from '../interfaces/jwtPayload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _baseUrl = `${environment.apiUrl}`;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.loadInitialUser();
  }
  
  private loadInitialUser(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.decodeAndMapUser(token);
      this.currentUserSubject.next(user);
    } else {
      if (this.getToken()) {
        this.logout();
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public login(credentials: AuthData): Observable<string | undefined> {
    return this._http.post<ApiResponse>(`${this._baseUrl}/login`, credentials).pipe(
      map((res: ApiResponse) => res.token_de_acesso),
      tap(token_de_acesso => {
        if (token_de_acesso) {
          localStorage.setItem('token', token_de_acesso);
          const user = this.decodeAndMapUser(token_de_acesso);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this._router.navigate(['/login']);
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
  
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  public isAdmin(): boolean {
    return this.currentUserValue?.administrador === true ||
      this.currentUserValue?.administrador === 1;
  }

  private getDecodedTokenPayload(token: string): JwtPayload | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Erro ao decodificar o payload do token JWT', e);
      return null;
    }
  }

  private decodeAndMapUser(token: string): User | null {
    const payload = this.getDecodedTokenPayload(token);
    if (!payload) return null;
    
    return {
      id: payload.id,
      email: payload.email,
      primeiro_nome: payload.primeiro_nome,
      sobrenome: payload.sobrenome,
      administrador: payload.administrador,
      criado_em: payload.criado_em,
      atualizado_em: payload.atualizado_em
    };
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.getDecodedTokenPayload(token);
    if (payload && payload.exp) {
      const expiry = payload.exp;
      return (Math.floor(Date.now() / 1000)) >= expiry;
    }
    return true;
  }

}
