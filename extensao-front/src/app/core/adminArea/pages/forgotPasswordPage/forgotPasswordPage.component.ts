import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-forgotPasswordPage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotPasswordPage.component.html',
  styleUrls: ['./forgotPasswordPage.component.scss']
})
export class ForgotPasswordPageComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _notificationService = inject(NotificationService);

  public form: FormGroup;
  public isSubmitting = false;

  constructor() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public requestResetLink(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.form.value.email;

    this._authService.requestPasswordReset(email).subscribe({
      next: () => {
        this._notificationService.addNotification('Se o e-mail estiver cadastrado, um link de recuperação foi enviado.', true);
        this._router.navigate(['/login']);
      },
      error: (err) => {
        const errorMessage = err.error?.falha || 'Ocorreu um erro. Tente novamente mais tarde.';
        this._notificationService.addNotification(errorMessage, false);
        this.isSubmitting = false;
      }
    });
  }

}
