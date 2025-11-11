import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PostsService } from '../../../../shared/services/posts.service';
import { CommonModule } from '@angular/common';
import { Publication } from '../../../../shared/interfaces/entities/publication';
import { UsersService } from '../../../../shared/services/users.service';
import { User } from '../../../../shared/interfaces/entities/user';
import { Paragraph } from '../../../../shared/interfaces/entities/paragraph';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CreatePublicationDTO } from '../../../../shared/interfaces/dto/publication/createPublication.dto';
import { ParagraphImg } from '../../../../shared/interfaces/paragraphImg';
import { UpdatePublicationDTO } from '../../../../shared/interfaces/dto/publication/updatePublication.dto';
import { ConfirmModalComponent } from '../../components/confirmModal/confirmModal.component';

@Component({
  selector: 'app-createEditPostPage',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ConfirmModalComponent],
  templateUrl: './createEditPostPage.component.html',
  styleUrls: ['./createEditPostPage.component.scss']
})
export class CreateEditPostPageComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _postService = inject(PostsService);
  private readonly _usersService = inject(UsersService);
  private readonly _notificationService = inject(NotificationService);
  
  private _post: Publication | undefined = undefined;
  public form!: FormGroup;
  public autoresFiltrados: User[] = [];
  public showSuggestions = false;
  public selectedAutorName = '';
  public isEditMode = false;

  public showConfirmationModal = false;
  public confirmationMessage = '';
  private deletionAction: 'publication' | 'paragraph' | null = null;
  private paragraphToDeleteIndex: number | null = null;

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      const id = Number(params['id']);
      if (!isNaN(id) && id > 0) {
        this.isEditMode = true;
        this.getPost(id);
      } else {
        this.isEditMode = false;
        this.initForm();
      }
    });
  };

  private initForm(post?: Publication): void {
    this.form = this._fb.group({
      titulo: [post?.titulo || '', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      subtitulo: [post?.subtitulo || '', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      capa: [null, !this.isEditMode ? Validators.required : null],
      autor_id: [{ value: post?.autor_id || null, disabled: this.isEditMode }, Validators.required],
      paragrafos: this._fb.array(
        post?.paragrafos && post.paragrafos.length > 0
          ? post.paragrafos.map(p => this.createParagraph(p))
          : [this.createParagraph()]
      )
    });

    if (this.isEditMode && post?.autor_id) {
      this.selectedAutorName = `${post.autor_nome} ${post.autor_sobrenome}`;
    }
  }

  private createParagraph(paragraph?: Paragraph): FormGroup {
    return this._fb.group({
      id: [paragraph?.id || null],
      posicao: [paragraph?.posicao || '', [Validators.required, Validators.min(1)]],
      conteudo: [paragraph?.conteudo || '', [Validators.required, Validators.minLength(25)]],
      imagem_apos_paragrafo: [paragraph?.imagem_apos_paragrafo ?? true],
      file: [null]
    });
  }

  public uploadPost(){
    if (this.form.invalid) {
      this._notificationService.addNotification('Formulário inválido', false);
      this.form.markAllAsTouched();
      return;
    }
    if (this.isEditMode && this._post) {
      this.updatePost();
    } else {
      this.createPost();
    }
  }
  
  public createPost(){
    const formValue = this.form.getRawValue();
    const capa = formValue.capa as File;
    
    const paragrafosImgs: ParagraphImg[] = [];
    const paragrafosDTO = formValue.paragrafos.map((p: any) => {
      if (p.file) paragrafosImgs.push({ position: p.posicao, file: p.file });
      const { file, id, ...paragrafoData } = p;
      return paragrafoData;
    });

    const postDTO: CreatePublicationDTO = {
      titulo: formValue.titulo,
      subtitulo: formValue.subtitulo,
      autor_id: formValue.autor_id,
      paragrafos: paragrafosDTO
    };

    this._postService.createPost(postDTO, capa, paragrafosImgs).subscribe({
      next: () => {
        this._notificationService.addNotification('Publicação criada com sucesso!', true);
        this._router.navigate(['/admin/posts']);
      },
      error: (err) => {
        this._notificationService.addNotification('Erro ao criar publicação.', false);
        console.error(err);
      }
    });
  }
  
  public updatePost(){
    if (!this._post?.id) return;

    const formValue = this.form.getRawValue();
    const capa = formValue.capa instanceof File ? formValue.capa : undefined;

    const paragrafosImgs: ParagraphImg[] = [];
    const paragrafosDTO = formValue.paragrafos.map((p: any) => {
        if (p.file) paragrafosImgs.push({ position: p.posicao, file: p.file });
        const { file, ...paragrafoData } = p;
        return paragrafoData;
    });

    const postDTO: UpdatePublicationDTO = {
        titulo: formValue.titulo,
        subtitulo: formValue.subtitulo,
        paragrafos: paragrafosDTO
    };
    
    this._postService.editPost(this._post.id, postDTO, capa, paragrafosImgs).subscribe({
        next: () => {
            this._notificationService.addNotification('Publicação atualizada com sucesso!', true);
            this._router.navigate(['/admin/posts']);
        },
        error: (err) => {
            this._notificationService.addNotification('Erro ao atualizar publicação.', false);
            console.error(err);
        }
    });
  }
  
  public getPost(id: number){
    this._postService.getPostById(id).subscribe({
      next: post => {
        if (post) {
          this._post = post;
          this.initForm(post);
        } else {
          this._notificationService.addNotification('Ooh não! Erro inesperado: você será redirecionado(a).', false);
          setTimeout(() => {
          this._router.navigate(['/admin/posts']);
        }, 3000);
        }
      },
      error: (e) => {
        this._notificationService.addNotification('Falha ao buscar publicação: você será redirecionado(a).', false);
        setTimeout(() => {
          this._router.navigate(['/admin/posts']);
        }, 3000);
      }
    })
  }

  public deletePublication(): void {
    if (!this._post?.id) return;
    this.confirmationMessage = `Tem certeza que deseja excluir a publicação "${this._post.titulo}"?`;
    this.deletionAction = 'publication';
    this.showConfirmationModal = true;
  }

  public confirmDeletion(): void {
    if (this.deletionAction === 'publication') {
      this.confirmPublicationDeletion();
    } else if (this.deletionAction === 'paragraph') {
      this.confirmParagraphDeletion();
    }
  }

  private confirmPublicationDeletion(): void {
    if (!this._post?.id) return;
    this._postService.deletePost(this._post.id).subscribe({
      next: () => {
        this._notificationService.addNotification('Publicação excluída com sucesso!', true);
        setTimeout(() => this._router.navigate(['/admin/posts']), 2000);
      },
      error: (err) => this._notificationService.addNotification('Falha ao excluir a publicação.', false),
      complete: () => this.closeModal()
    });
  }

  private confirmParagraphDeletion(): void {
    if (this.paragraphToDeleteIndex === null) return;
    const paragraphId = this.paragrafos.at(this.paragraphToDeleteIndex).get('id')?.value;
    if (!paragraphId) {
      this.closeModal();
      return;
    }
    this._postService.deletePragraph(paragraphId).subscribe({
      next: () => {
        this._notificationService.addNotification('Parágrafo excluído com sucesso!', true);
        this.paragrafos.removeAt(this.paragraphToDeleteIndex as number);
      },
      error: (err) => this._notificationService.addNotification('Falha ao excluir o parágrafo.', false),
      complete: () => this.closeModal()
    });
  }

  public closeModal(): void {
    this.showConfirmationModal = false;
    this.deletionAction = null;
    this.paragraphToDeleteIndex = null;
    this.confirmationMessage = '';
  }

  public onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.selectedAutorName = term;
    this.showSuggestions = !!term;

    if (term.length > 2) {
      this._usersService.getUsers({ buscar: term }).subscribe(res => {
        this.autoresFiltrados = res.usuarios ?? [];
      });
    } else {
      this.autoresFiltrados = [];
    }
  }

  public selectAutor(autor: User) {
    this.form.get('autor_id')?.setValue(autor.id);
    this.selectedAutorName = `${autor.primeiro_nome} ${autor.sobrenome}`;
    this.showSuggestions = false;
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.form.get('capa')?.setValue(input.files[0]);
    } else {
      this.form.get('capa')?.setValue(null);
    }
  }

  public onParagraphFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.paragrafos.at(index).get('file')?.setValue(input.files[0]);
    } else {
      this.paragrafos.at(index).get('file')?.setValue(null);
    }
  }

  public addParagraph(): void {
    this.paragrafos.push(this.createParagraph());
  }

  public removeParagraph(index: number): void {
    if (this.paragrafos.length <= 1) {
      this._notificationService.addNotification('A publicação deve ter pelo menos um parágrafo.', false);
      return;
    }
    const paragraphId = this.paragrafos.at(index).get('id')?.value;
    if (this.isEditMode && paragraphId) {
      this.paragraphToDeleteIndex = index;
      this.confirmationMessage = 'Tem certeza que deseja excluir este parágrafo?';
      this.deletionAction = 'paragraph';
      this.showConfirmationModal = true;
    } else {
      this.paragrafos.removeAt(index);
    }
  }
  
  getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  getParagraphControl(index: number, controlName: string): AbstractControl | null {
    return this.paragrafos.at(index)?.get(controlName);
  }

  get paragrafos(): FormArray {
    return this.form.get('paragrafos') as FormArray;
  }

  get post(): Publication | undefined {
    return this._post;
  }

}
