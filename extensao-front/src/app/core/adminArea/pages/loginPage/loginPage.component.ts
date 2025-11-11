import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { AuthData } from '../../../../shared/interfaces/requests/authData';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-loginPage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
    ],
  templateUrl: './loginPage.component.html',
  styleUrls: ['./loginPage.component.scss']
})
export class LoginPageComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _authService = inject(AuthService);
  private readonly _notificationService = inject(NotificationService);

  public loginForm: FormGroup;
  public loginBtnMsg: string = 'Login';
  public loginBtnDisable: boolean = false;

  constructor(){
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  public login() {
    if(this.loginForm.valid){
      this.loginBtnDisable = true;
      this.loginBtnMsg = "Loging...";
      const authData: AuthData = {
        email: this.loginForm.value.email,
        senha: this.loginForm.value.senha
      }
      
      this._authService.login(authData).subscribe({
        next: () => {
          this._notificationService.addNotification('Login realizado com sucesso!', true);
          const next = this._route.snapshot.queryParamMap.get('next');
          this._router.navigateByUrl(next || 'admin/dashboard');
        },
        error: (err) => {
          this.loginBtnDisable = false;
          this.loginBtnMsg = "Login";
          const errorMessage = err.error?.falha || 'Email ou senha inválidos.';
          this._notificationService.addNotification(errorMessage, false);
        }
      });
    }
  }

}
