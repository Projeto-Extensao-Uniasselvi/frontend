import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { PostsService } from '../../../../shared/services/posts.service';
import { Publication } from '../../../../shared/interfaces/entities/publication';
import { Pagination } from '../../../../shared/interfaces/pagination';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ConfirmModalComponent } from '../../components/confirmModal/confirmModal.component';

@Component({
  selector: 'app-postsPage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './postsPage.component.html',
  styleUrls: ['./postsPage.component.scss']
})
export class PostsPageComponent implements OnInit {
  private readonly _postsService = inject(PostsService);
  private readonly _router = inject(Router);
  private readonly _notificationService = inject(NotificationService);

  public posts: Publication[] = [];
  public pagination: Pagination | null = null;
  public isLoading = true;

  public searchControl = new FormControl('');
  private searchTerms = new Subject<string>();

  public showConfirmationModal = false;
  public postToDeleteId: number | null = null;
  public confirmationMessage = '';

  ngOnInit(): void {
    this.getPosts();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.isLoading = true;
        if (term.trim()) {
          return this._postsService.getByTitle({ buscar: term, pagina: 1, limite: 10 });
        } else {
          return this._postsService.getPosts({ pagina: 1, limite: 10 });
        }
      })
    ).subscribe({
      next: (response) => this.handleResponse(response),
      error: (err) => this.handleError(err)
    });
  }

  private getPosts(page = 1, limit = 10): void {
    this.isLoading = true;
    const term = this.searchControl.value || '';

    const apiCall = term.trim()
      ? this._postsService.getByTitle({ buscar: term, pagina: page, limite: limit })
      : this._postsService.getPosts({ pagina: page, limite: limit });

    apiCall.subscribe({
      next: (response) => this.handleResponse(response),
      error: (err) => this.handleError(err)
    });
  }
  
  public onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerms.next(term);
  }

  private handleResponse(response: any): void {
    this.posts = response.publicacoes || [];
    this.pagination = response.paginacao || null;
    this.isLoading = false;
  }

  private handleError(error: any): void {
    this._notificationService.addNotification('Falha ao buscar publicações.', false);
    this.isLoading = false;
    console.error(error);
  }
  
  public deletePost(id: number, title: string): void {
    this.postToDeleteId = id;
    this.confirmationMessage = `Tem certeza que deseja excluir a publicação "${title}"?`;
    this.showConfirmationModal = true;
  }
  
  public confirmDeletion(): void {
    if (!this.postToDeleteId) return;

    this._postsService.deletePost(this.postToDeleteId).subscribe({
      next: () => {
        this._notificationService.addNotification('Publicação excluída com sucesso!', true);
        this.getPosts(this.pagination?.pagina_atual || 1); 
      },
      error: (err) => {
        this._notificationService.addNotification('Falha ao excluir a publicação.', false);
        console.error(err);
      },
      complete: () => {
        this.closeModal();
      }
    });
  }

  public closeModal(): void {
    this.showConfirmationModal = false;
    this.postToDeleteId = null;
    this.confirmationMessage = '';
  }
  
  public goToEdit(id: number): void {
    this._router.navigate(['/admin/post/', id]);
  }

  public goToCreate(): void {
    this._router.navigate(['/admin/post/new']);
  }

  public changePage(page: number): void {
    if (page >= 1 && (!this.pagination || page <= this.pagination.paginas)) {
      this.getPosts(page);
    }
  }
  
  getPages(): number[] {
    if (!this.pagination) return [];
    return Array(this.pagination.paginas).fill(0).map((x, i) => i + 1);
  }

}
