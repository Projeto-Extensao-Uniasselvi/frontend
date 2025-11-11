import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../shared/services/posts.service';
import { Publication } from '../../../../shared/interfaces/entities/publication';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homePage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.scss']
})
export class HomePageComponent implements OnInit {
  private readonly _postsService = inject(PostsService);
  private readonly _notificationService = inject(NotificationService);

  public recentPosts: Publication[] = [];
  public isLoading = true;

  ngOnInit(): void {
    this.loadRecentPosts();
  }

  private loadRecentPosts(): void {
    this._postsService.getPosts({ recentes: true, limite: 4 }).subscribe({
      next: (response) => {
        this.recentPosts = response.publicacoes || [];
        this.isLoading = false;
      },
      error: (err) => {
        this._notificationService.addNotification('Falha ao buscar posts recentes', false);
        this.isLoading = false;
      }
    });
  }

}
