import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="animate-fade-in">
      <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-[26px] font-bold text-stone-900 mb-1.5">Welcome Back</h1>
      <p class="text-sm text-stone-600 mb-7">Sign in to your Nisha Pure Oils account</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-1" novalidate>
        <!-- Email -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email Address</mat-label>
          <input
            matInput
            type="email"
            formControlName="email"
            placeholder="you@example.com"
            autocomplete="email"
            id="login-email"
          />
          <mat-icon matPrefix>email</mat-icon>
          @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
            <mat-error>Please enter a valid email</mat-error>
          }
        </mat-form-field>

        <!-- Password -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Password</mat-label>
          <input
            matInput
            [type]="hidePassword ? 'password' : 'text'"
            formControlName="password"
            placeholder="Your password"
            autocomplete="current-password"
            id="login-password"
          />
          <mat-icon matPrefix>lock</mat-icon>
          <button
            mat-icon-button
            matSuffix
            type="button"
            (click)="hidePassword = !hidePassword"
            [attr.aria-label]="hidePassword ? 'Show password' : 'Hide password'"
          >
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        <!-- Remember Me + Forgot -->
        <div class="flex items-center justify-between my-1 mb-4">
          <mat-checkbox formControlName="rememberMe" color="primary">
            Remember me
          </mat-checkbox>
          <a routerLink="/auth/forgot-password" class="text-[13px] text-primary hover:underline">Forgot password?</a>
        </div>

        <!-- Submit -->
        <button
          mat-raised-button
          color="primary"
          type="submit"
          class="w-full !h-12 !rounded-xl !text-[15px] !font-semibold flex items-center justify-center"
          [disabled]="isLoading || loginForm.invalid"
          id="login-submit"
        >
          @if (isLoading) {
            <mat-spinner diameter="20" />
          } @else {
            Sign In
          }
        </button>

        <!-- Error message -->
        @if (errorMessage) {
          <div class="flex items-center gap-2 p-3 sm:px-4 bg-red-50 border border-red-200 rounded-[10px] text-red-600 text-[13.5px] mt-2" role="alert">
            <mat-icon>error_outline</mat-icon>
            {{ errorMessage }}
          </div>
        }
      </form>

      <!-- Register link -->
      <p class="text-center mt-5 text-sm text-stone-600">
        Don't have an account?
        <a routerLink="/auth/register" class="text-primary font-semibold hover:underline">Create one</a>
      </p>
    </div>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';
  private returnUrl = '/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/home';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Invalid email or password.';
      },
    });
  }
}
