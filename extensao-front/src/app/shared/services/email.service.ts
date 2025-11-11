import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../interfaces/apiResponse';
import { ContactData } from '../interfaces/requests/contactData';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = `${environment.apiUrl}/email`;

  sendContactEmail(contactData: ContactData): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`${this._baseUrl}/contato`, contactData);
  }

}
