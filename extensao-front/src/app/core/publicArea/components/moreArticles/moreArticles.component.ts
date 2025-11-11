import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Publication } from '../../../../shared/interfaces/entities/publication';
import { PostsService } from '../../../../shared/services/posts.service';

@Component({
  selector: 'app-moreArticles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moreArticles.component.html',
  styleUrls: ['./moreArticles.component.scss']
})
export class MoreArticlesComponent implements OnInit {
  private readonly _postsService = inject(PostsService);

  @Input() currentPostId?: number;
  public relatedPosts: Publication[] = [];
  public isLoading = true;

  ngOnInit(): void {
    this.loadRelatedPosts();
  }

  private loadRelatedPosts(): void {
    this.isLoading = true;
    this._postsService.getPosts({ pagina: 1, limite: 3, recentes: true }).subscribe({
      next: (response) => {
        const allPosts = response.publicacoes || [];
        this.relatedPosts = allPosts
          .filter(p => p.id !== this.currentPostId)
          .slice(0, 2);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Falha ao buscar artigos relacionados.', err);
        this.isLoading = false;
      }
    });
  }

}
