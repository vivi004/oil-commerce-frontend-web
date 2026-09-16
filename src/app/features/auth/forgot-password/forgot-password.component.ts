import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="animate-fade-in">
      <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-[26px] font-bold text-stone-900 mb-1.5">Forgot Password?</h1>
      <p class="text-sm text-stone-600 mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      @if (!emailSent) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1" novalidate>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email Address</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input matInput type="email" formControlName="email" id="fp-email" />
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <mat-error>Enter a valid email</mat-error>
            }
          </mat-form-field>

          <button
            mat-raised-button color="primary"
            type="submit"
            class="w-full !h-12 !rounded-xl !text-[15px] !font-semibold mt-2 flex items-center justify-center"
            [disabled]="isLoading || form.invalid"
            id="fp-submit"
          >
            @if (isLoading) { <mat-spinner diameter="20" /> } @else { Send Reset Link }
          </button>
        </form>
      } @else {
        <div class="text-center p-5 animate-fade-in">
          <div class="text-[56px] mb-4">📬</div>
          <h3 class="text-xl font-bold font-['Outfit',sans-serif] text-stone-900 mb-2">Check your email</h3>
          <p class="text-sm text-stone-600 mb-3">We sent a password reset link to <strong>{{ form.get('email')?.value }}</strong></p>

          @if (directResetUrl) {
            <div class="bg-amber-50 border border-amber-300 rounded-xl p-4 my-4 text-left shadow-sm">
              <p class="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                <span>⚡</span> Direct Reset Link:
              </p>
              <a [routerLink]="directResetUrl" class="text-sm text-amber-800 font-bold hover:underline flex items-center gap-1 break-all">
                Click here to reset your password now &rarr;
              </a>
            </div>
          }

          <button mat-button color="primary" (click)="emailSent = false">Resend email</button>
        </div>
      }

      <p class="text-center mt-5 text-sm text-stone-600">
        Remember your password?
        <a routerLink="/auth/login" class="text-primary font-semibold hover:underline">Sign in</a>
      </p>
    </div>
  `,
  styles: [],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isLoading = false;
  emailSent = false;
  directResetUrl: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.forgotPassword(this.form.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.emailSent = true;
          this.directResetUrl = data?.resetUrl ?? null;
        },
        error: (err) => {
          const msg = err?.error?.message ?? err?.message ?? 'Failed to send reset email. The server may be waking up, please try again.';
          this.toastr.error(msg);
        },
      });
  }
}
