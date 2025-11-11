import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { tap, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';
import { Publication } from '../../../../shared/interfaces/entities/publication';
import { Pagination } from '../../../../shared/interfaces/pagination';
import { PostsService } from '../../../../shared/services/posts.service';

@Component({
  selector: 'app-articlesPage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './articlesPage.component.html',
  styleUrls: ['./articlesPage.component.scss']
})
export class ArticlesPageComponent implements OnInit {
  private readonly _postsService = inject(PostsService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  public posts: Publication[] = [];
  public pagination: Pagination | null = null;
  public isLoading = true;
  public searchControl = new FormControl('');

  ngOnInit(): void {
    // Escuta as mudanças nos parâmetros da URL (página e busca) para buscar os dados
    this._route.queryParamMap.pipe(
      tap(() => this.isLoading = true),
      switchMap(params => {
        const page = Number(params.get('pagina')) || 1;
        const search = params.get('buscar') || '';
        
        // Atualiza o campo de busca sem disparar um novo evento de valueChanges
        if (this.searchControl.value !== search) {
          this.searchControl.setValue(search, { emitEvent: false });
        }
        
        if (search) {
          return this._postsService.getByTitle({ buscar: search, pagina: page, limite: 6 });
        } else {
          return this._postsService.getPosts({ pagina: page, limite: 6 });
        }
      })
    ).subscribe({
      next: (response) => {
        this.posts = response.publicacoes || [];
        this.pagination = response.paginacao || null;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Falha ao buscar artigos.', err);
      }
    });

    // Escuta as mudanças no campo de busca para atualizar a URL
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.navigateToPage(1, term || '');
    });
  }

  public changePage(newPage: number): void {
    if (!this.pagination || newPage < 1 || newPage > this.pagination.paginas) {
      return;
    }
    this.navigateToPage(newPage, this.searchControl.value || '');
  }

  private navigateToPage(page: number, search: string): void {
    const queryParams: any = { pagina: page };
    if (search) {
      queryParams.buscar = search;
    } else {
      // Garante que o parâmetro 'buscar' seja removido se estiver vazio
      queryParams.buscar = null;
    }

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

}
