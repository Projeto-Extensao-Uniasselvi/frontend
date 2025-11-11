import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { User } from '../../../../shared/interfaces/entities/user';
import { Pagination } from '../../../../shared/interfaces/pagination';
import { NotificationService } from '../../../../shared/services/notification.service';
import { UsersService } from '../../../../shared/services/users.service';
import { ConfirmModalComponent } from '../../components/confirmModal/confirmModal.component';

@Component({
  selector: 'app-usersPage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './usersPage.component.html',
  styleUrls: ['./usersPage.component.scss']
})
export class UsersPageComponent implements OnInit {
  private readonly _usersService = inject(UsersService);
  private readonly _router = inject(Router);
  private readonly _notificationService = inject(NotificationService);

  public users: User[] = [];
  public pagination: Pagination | null = null;
  public isLoading = true;

  public searchControl = new FormControl('');
  private searchTerms = new Subject<string>();

  public showConfirmationModal = false;
  public userToDeleteId: number | null = null;
  public confirmationMessage = '';

  ngOnInit(): void {
    this.getUsers();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.isLoading = true;
        if (term.trim()) {
          return this._usersService.getUsers({ buscar: term, pagina: 1, limite: 10 });
        } else {
          return this._usersService.getUsers({ pagina: 1, limite: 10 });
        }
      })
    ).subscribe({
      next: (response) => this.handleResponse(response),
      error: (err) => this.handleError(err)
    });
  }

  private getUsers(page = 1, limit = 10): void {
    this.isLoading = true;
    const term = this.searchControl.value || '';

    const apiCall = term.trim()
      ? this._usersService.getUsers({ buscar: term, pagina: page, limite: limit })
      : this._usersService.getUsers({ pagina: page, limite: limit });

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
    this.users = response.usuarios || [];
    this.pagination = response.paginacao || null;
    this.isLoading = false;
  }

  private handleError(error: any): void {
    this._notificationService.addNotification('Falha ao buscar usuários.', false);
    this.isLoading = false;
    console.error(error);
  }
  
  public deleteUser(id: number, name: string): void {
    this.userToDeleteId = id;
    this.confirmationMessage = `Tem certeza que deseja excluir o usuário "${name}"?`;
    this.showConfirmationModal = true;
  }

  public confirmDeletion(): void {
    if (!this.userToDeleteId) return;

    this._usersService.deleteUser(this.userToDeleteId).subscribe({
      next: () => {
        this._notificationService.addNotification('Usuário excluído com sucesso!', true);
        this.getUsers(this.pagination?.pagina_atual || 1); 
      },
      error: (err) => {
        this._notificationService.addNotification('Falha ao excluir o usuário.', false);
        console.error(err);
      },
      complete: () => {
        this.closeModal();
      }
    });
  }

  public closeModal(): void {
    this.showConfirmationModal = false;
    this.userToDeleteId = null;
    this.confirmationMessage = '';
  }
  
  public goToEdit(id: number): void {
    this._router.navigate(['/admin/user/', id]);
  }

  public goToCreate(): void {
    this._router.navigate(['/admin/user/new']);
  }

  public changePage(page: number): void {
    if (page >= 1 && (!this.pagination || page <= this.pagination.paginas)) {
      this.getUsers(page);
    }
  }

  getPages(): number[] {
    if (!this.pagination) return [];
    return Array(this.pagination.paginas).fill(0).map((x, i) => i + 1);
  }

}
