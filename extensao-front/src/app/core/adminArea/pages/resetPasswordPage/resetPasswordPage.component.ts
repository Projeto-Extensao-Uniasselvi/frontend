import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const senhaNova = group.get('senha_nova')?.value;
  const confirmarSenha = group.get('confirmar_senha_nova')?.value;
  return senhaNova === confirmarSenha ? null : { mismatch: true };
}

@Component({
  selector: 'app-resetPasswordPage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetPasswordPage.component.html',
  styleUrls: ['./resetPasswordPage.component.scss']
})
export class ResetPasswordPageComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _authService = inject(AuthService);
  private readonly _notificationService = inject(NotificationService);

  public form!: FormGroup;
  public isSubmitting = false;
  private token: string | null = null;

  ngOnInit(): void {
    this.token = this._route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this._notificationService.addNotification('Token de recuperação inválido ou ausente.', false);
      this._router.navigate(['/login']);
      return;
    }

    this.form = this._fb.group({
      senha_nova: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,30}$/)
      ]],
      confirmar_senha_nova: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  public resetPassword(): void {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newPassword = this.form.value.senha_nova;

    this._authService.resetPassword(newPassword, this.token).subscribe({
      next: () => {
        this._notificationService.addNotification('Senha redefinida com sucesso! Você já pode fazer login.', true);
        this._router.navigate(['/login']);
      },
      error: (err) => {
        const errorMessage = err.error?.falha || 'Não foi possível redefinir a senha. O link pode ter expirado.';
        this._notificationService.addNotification(errorMessage, false);
        this.isSubmitting = false;
      }
    });
  }

  getControl(controlName: string) {
    return this.form.get(controlName);
  }

}
