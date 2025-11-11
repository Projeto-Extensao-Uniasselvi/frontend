import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap } from 'rxjs';
import { Publication } from '../../../../shared/interfaces/entities/publication';
import { PostsService } from '../../../../shared/services/posts.service';
import { MoreArticlesComponent } from '../../components/moreArticles/moreArticles.component';

@Component({
  selector: 'app-articleView',
  standalone: true,
  imports: [CommonModule,MoreArticlesComponent],
  templateUrl: './articleView.component.html',
  styleUrls: ['./articleView.component.scss']
})
export class ArticleViewComponent implements OnInit {
  private readonly _postsService = inject(PostsService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  public post: Publication | null = null;
  public isLoading = true;

  ngOnInit(): void {
    this._route.paramMap.pipe(
      tap(() => {
        this.isLoading = true;
        this.post = null;
        window.scrollTo(0, 0);
      }),
      switchMap(params => {
        const id = Number(params.get('id'));
        if (isNaN(id) || id <= 0) {
          this._router.navigate(['/articles']);
          return [];
        }
        return this._postsService.getPostById(id);
      })
    ).subscribe({
      next: (post) => {
        if (post) {
          post.paragrafos.sort((a, b) => Number(a.posicao) - Number(b.posicao));
          this.post = post;
        } else {
          this._router.navigate(['/articles']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Falha ao buscar o artigo.', err);
        this._router.navigate(['/articles']);
      }
    });
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
