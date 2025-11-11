import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/apiResponse';
import { Publication } from '../interfaces/entities/publication';
import { CreatePublicationDTO } from '../interfaces/dto/publication/createPublication.dto';
import { UpdatePublicationDTO } from '../interfaces/dto/publication/updatePublication.dto';
import { ParagraphImg } from '../interfaces/paragraphImg';
import { environment } from '../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = `${environment.apiUrl}/publicacoes`;

  getPosts( params?: {
    pagina?: number;
    limite?: number;
    recentes?: boolean
  }): Observable<ApiResponse> {
    return this._http.get<ApiResponse>(this._baseUrl, { params })
  }
  
  getPostById(id: number): Observable<Publication|undefined> {
    return this._http.get<ApiResponse>(`${this._baseUrl}/${id}`).pipe(
      map(res => res.publicacao)
    );
  }
  
  getByTitle(params?: {buscar: string, pagina: number , limite: number}): Observable<ApiResponse> {
    return this._http.get<ApiResponse>(`${this._baseUrl}/titulos`, { params });
  }
  
  createPost(
    post: CreatePublicationDTO,
    capa?: File,
    paragrafosImgs?: ParagraphImg[]
  ): Observable<Publication|undefined> {
    const form = new FormData();
    form.append('publicacao', JSON.stringify(post));
    if (capa) form.append('capa', capa);
    paragrafosImgs?.forEach((fileData) => {
      form.append(`paragrafo_${fileData.position}`, fileData.file);
    });

    return this._http.post<ApiResponse>(this._baseUrl, form).pipe(
        map( res => res.publicacao )
    );
  }

  editPost(
    id: number,
    post: UpdatePublicationDTO,
    capa?: File,
    paragrafosImgs?: ParagraphImg[]
  ): Observable<ApiResponse> {
    const form = new FormData();
    form.append('publicacao', JSON.stringify(post));
    if (capa) form.append('capa', capa);
    if (post.paragrafos != undefined && post.paragrafos?.length > 0) {
      paragrafosImgs?.forEach((fileData) => {
        form.append(`paragrafo_${fileData.position}`, fileData.file);
      });
    };

    return this._http.patch<ApiResponse>(`${this._baseUrl}/${id}`, form);
  }

  deletePost(id: number): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this._baseUrl}/${id}`);
  }

  deletePragraph(id: number): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${environment.apiUrl}/paragrafos/${id}`);
  }

}
