import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../shared/interfaces/entities/user';
import { NotificationService } from '../../../../shared/services/notification.service';
import { UsersService } from '../../../../shared/services/users.service';
import { of, forkJoin } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-createEditUserPage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createEditUserPage.component.html',
  styleUrls: ['./createEditUserPage.component.scss']
})
export class CreateEditUserPageComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _usersService = inject(UsersService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _authService = inject(AuthService);

  public form!: FormGroup;
  public isEditMode = false;
  private userId: number | null = null;
  public initialUserEmail = '';
  public canChangePassword = false;

  // Flags to control UI sections in edit mode
  public isEditingEmail = false;
  public isEditingPassword = false;

  ngOnInit(): void {
    const loggedInUser = this._authService.currentUserValue;

    this._activatedRoute.params.subscribe(params => {
      const id = Number(params['id']);
      if (!isNaN(id) && id > 0) {
        this.isEditMode = true;
        this.userId = id;
        if (loggedInUser && loggedInUser.id === this.userId) {
          this.canChangePassword = true;
        }
        this.getUser(id);
      } else {
        this.isEditMode = false;
        this.initCreateForm();
      }
    });
  }

  // --- FORM VALIDATORS ---
  private emailMatchValidator(group: AbstractControl): ValidationErrors | null {
    const email = group.get('novo_email')?.value;
    const confirmEmail = group.get('confirmar_novo_email')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('senha_nova')?.value;
    const confirmPassword = group.get('confirmar_senha_nova')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  private createPasswordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('senha')?.value;
    const confirmPassword = group.get('confirmar_senha')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private createEmailMatchValidator(group: AbstractControl): ValidationErrors | null {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmar_email')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  // --- FORM INITIALIZATION ---
  private initCreateForm(): void {
    this.form = this._fb.group({
      primeiro_nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      sobrenome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      confirmar_email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)]],
      confirmar_senha: ['', [Validators.required]],
      administrador: [false, Validators.required]
    }, {
      validators: [this.createEmailMatchValidator, this.createPasswordMatchValidator]
    });
  }

  private initEditForm(user: User): void {
    this.initialUserEmail = user.email;
    this.form = this._fb.group({
      profile: this._fb.group({
        primeiro_nome: [user.primeiro_nome, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
        sobrenome: [user.sobrenome, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
        administrador: [user.administrador, Validators.required]
      })
    });
  }

  // --- UI CONTROL METHODS FOR EDIT MODE ---
  public startEmailEdit(): void {
    this.isEditingEmail = true;
    const emailGroup = this._fb.group({
      novo_email: ['', [Validators.required, Validators.email]],
      confirmar_novo_email: ['', [Validators.required, Validators.email]]
    }, { validators: this.emailMatchValidator });
    this.form.addControl('emailGroup', emailGroup);
  }

  public cancelEmailEdit(): void {
    this.isEditingEmail = false;
    this.form.removeControl('emailGroup');
  }

  public startPasswordEdit(): void {
    this.isEditingPassword = true;
    const passwordGroup = this._fb.group({
      senha_atual: ['', Validators.required],
      senha_nova: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)]],
      confirmar_senha_nova: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    this.form.addControl('changePasswordGroup', passwordGroup);
  }

  public cancelPasswordEdit(): void {
    this.isEditingPassword = false;
    this.form.removeControl('changePasswordGroup');
  }

  // --- DATA HANDLING ---
  private getUser(id: number): void {
    this._usersService.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
          this.initEditForm(user);
        } else {
          this._notificationService.addNotification('Usuário não encontrado.', false);
          this._router.navigate(['/admin/users']);
        }
      },
      error: () => {
        this._notificationService.addNotification('Falha ao buscar dados do usuário.', false);
        this._router.navigate(['/admin/users']);
      }
    });
  }

  public submitForm(): void {
    if (this.form.invalid) {
      this._notificationService.addNotification('Formulário inválido. Verifique os campos.', false);
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser(): void {
    const { confirmar_email, confirmar_senha, ...userData } = this.form.value;
    this._usersService.createUser(userData).subscribe({
      next: () => {
        this._notificationService.addNotification('Usuário criado com sucesso!', true);
        this._router.navigate(['/admin/users']);
      },
      error: (err) => {
        const errorMessage = err.error?.falha || 'Falha ao criar usuário.';
        this._notificationService.addNotification(errorMessage, false);
      }
    });
  }

  private updateUser(): void {
    if (!this.userId) return;

    const profileControl = this.form.get('profile');
    const emailControl = this.form.get('emailGroup');
    const passwordControl = this.form.get('changePasswordGroup');

    const profilePayload: any = {};
    if (profileControl?.valid && profileControl.dirty) {
      Object.assign(profilePayload, profileControl.value);
    }
    if (emailControl?.valid && emailControl.dirty) {
      profilePayload.email = emailControl.value.novo_email;
    }

    const passwordPayload: any = {};
    if (passwordControl?.valid && passwordControl.dirty) {
        if (passwordControl.value.senha_atual === passwordControl.value.senha_nova) {
            this._notificationService.addNotification('A nova senha não pode ser igual à senha atual.', false);
            return;
        }
        passwordPayload.senha_atual = passwordControl.value.senha_atual;
        passwordPayload.senha_nova = passwordControl.value.senha_nova;
    }

    const hasProfileChanges = Object.keys(profilePayload).length > 0;
    const hasPasswordChanges = Object.keys(passwordPayload).length > 0;

    if (!hasProfileChanges && !hasPasswordChanges) {
      this._notificationService.addNotification('Nenhuma alteração foi feita.', true);
      return;
    }

    const updateProfile$ = hasProfileChanges ? this._usersService.updateUser(this.userId, profilePayload) : of(null);
    const changePassword$ = hasPasswordChanges ? this._usersService.changePassword(passwordPayload) : of(null);

    forkJoin([updateProfile$, changePassword$]).subscribe({
        next: ([profileRes, passwordRes]) => {
            if (hasPasswordChanges) {
                this._notificationService.addNotification('Senha alterada com sucesso! Faça login novamente.', true);
                this._authService.logout();
            } else {
                this._notificationService.addNotification('Usuário atualizado com sucesso!', true);
                this._router.navigate(['/admin/users']);
            }
        },
        error: (err) => {
            const errorMessage = err.error?.falha || 'Falha ao atualizar usuário.';
            this._notificationService.addNotification(errorMessage, false);
        }
    });
  }

  // --- TEMPLATE HELPERS ---
  public getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  public getProfileControl(controlName: string): AbstractControl | null {
    return this.form.get('profile')?.get(controlName) ?? null;
  }
  
  public getEmailGroupControl(controlName: string): AbstractControl | null {
    return this.form.get('emailGroup')?.get(controlName) ?? null;
  }
  
  public getPasswordGroupControl(controlName: string): AbstractControl | null {
    return this.form.get('changePasswordGroup')?.get(controlName) ?? null;
  }

}
