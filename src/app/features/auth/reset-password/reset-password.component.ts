import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(c: AbstractControl): ValidationErrors | null {
  const p = c.get('password'), cp = c.get('confirmPassword');
  if (p && cp && p.value !== cp.value) { cp.setErrors({ mismatch: true }); return { mismatch: true }; }
  return null;
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="animate-fade-in">
      <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-[26px] font-bold text-stone-900 mb-1.5">Reset Password</h1>
      <p class="text-sm text-stone-600 mb-6">Choose a new secure password for your account.</p>

      @if (!resetDone) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1" novalidate>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>New Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input matInput [type]="hide1 ? 'password' : 'text'" formControlName="password" id="rp-password" />
            <button mat-icon-button matSuffix type="button" (click)="hide1 = !hide1">
              <mat-icon>{{ hide1 ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.get('password')?.hasError('minlength') && form.get('password')?.touched) {
              <mat-error>Minimum 8 characters</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Confirm New Password</mat-label>
            <mat-icon matPrefix>lock_outline</mat-icon>
            <input matInput [type]="hide2 ? 'password' : 'text'" formControlName="confirmPassword" id="rp-confirm" />
            <button mat-icon-button matSuffix type="button" (click)="hide2 = !hide2">
              <mat-icon>{{ hide2 ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.get('confirmPassword')?.hasError('mismatch') && form.get('confirmPassword')?.touched) {
              <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="w-full !h-12 !rounded-xl !text-[15px] !font-semibold mt-2 flex items-center justify-center" [disabled]="isLoading || form.invalid" id="rp-submit">
            @if (isLoading) { <mat-spinner diameter="20" /> } @else { Reset Password }
          </button>
        </form>
      } @else {
        <div class="text-center p-5 animate-fade-in">
          <div class="text-[56px] mb-4">✅</div>
          <h3 class="text-xl font-bold font-['Outfit',sans-serif] text-stone-900 mb-4">Password reset successfully!</h3>
          <a mat-raised-button color="primary" routerLink="/auth/login" class="!h-11 !px-6 !rounded-xl">Sign In Now</a>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  hide1 = true; hide2 = true;
  resetDone = false;
  private token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] ?? '';
    this.form = this.fb.group(
      { password: ['', [Validators.required, Validators.minLength(8)]], confirmPassword: ['', Validators.required] },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.resetPassword({ token: this.token, ...this.form.value }).subscribe({
      next: () => { this.isLoading = false; this.resetDone = true; },
      error: (err) => { this.isLoading = false; this.toastr.error(err?.error?.message ?? 'Reset failed.'); },
    });
  }
}
