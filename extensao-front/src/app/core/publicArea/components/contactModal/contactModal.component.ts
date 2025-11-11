import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../../../shared/services/email.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-contactModal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contactModal.component.html',
  styleUrls: ['./contactModal.component.scss']
})
export class ContactModalComponent {
  @Output() close = new EventEmitter<void>();

  private readonly _fb = inject(FormBuilder);
  private readonly _emailService = inject(EmailService);
  private readonly _notificationService = inject(NotificationService);

  public contactForm: FormGroup;
  public isSubmitting = false;

  constructor() {
    this.contactForm = this._fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mensagem: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  public closeModal(): void {
    this.close.emit();
  }

  public submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this._notificationService.addNotification('Por favor, preencha o formulário corretamente.', false);
      return;
    }

    this.isSubmitting = true;
    this._emailService.sendContactEmail(this.contactForm.value).subscribe({
      next: () => {
        this._notificationService.addNotification('Mensagem enviada com sucesso! Agradecemos o contato.', true);
        this.isSubmitting = false;
        this.closeModal();
      },
      error: (err) => {
        this._notificationService.addNotification('Houve um erro ao enviar a mensagem. Tente novamente mais tarde.', false);
        this.isSubmitting = false;
        console.error('Falha ao enviar e-mail de contato', err);
      }
    });
  }
  
  getControl(controlName: string) {
    return this.contactForm.get(controlName);
  }

}
