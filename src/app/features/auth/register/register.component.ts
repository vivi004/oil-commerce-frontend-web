import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm  = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="animate-fade-in">
      <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-[26px] font-bold text-stone-900 mb-1.5">Create Account</h1>
      <p class="text-sm text-stone-600 mb-6">Join thousands of families enjoying pure traditional oils</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-1" novalidate>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-3">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" id="reg-firstname" />
            @if (f['firstName'].invalid && f['firstName'].touched) {
              <mat-error>First name required</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" id="reg-lastname" />
            @if (f['lastName'].invalid && f['lastName'].touched) {
              <mat-error>Last name required</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email Address</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput type="email" formControlName="email" id="reg-email" />
          @if (f['email'].hasError('required') && f['email'].touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (f['email'].hasError('email') && f['email'].touched) {
            <mat-error>Invalid email address</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Phone (optional)</mat-label>
          <mat-icon matPrefix>phone</mat-icon>
          <input matInput type="tel" formControlName="phone" id="reg-phone" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Password</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input
            matInput
            [type]="hidePassword ? 'password' : 'text'"
            formControlName="password"
            id="reg-password"
          />
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (f['password'].hasError('minlength') && f['password'].touched) {
            <mat-error>Password must be at least 8 characters</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Confirm Password</mat-label>
          <mat-icon matPrefix>lock_outline</mat-icon>
          <input
            matInput
            [type]="hideConfirm ? 'password' : 'text'"
            formControlName="confirmPassword"
            id="reg-confirm-password"
          />
          <button mat-icon-button matSuffix type="button" (click)="hideConfirm = !hideConfirm">
            <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (f['confirmPassword'].hasError('passwordMismatch') && f['confirmPassword'].touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>

        <mat-checkbox formControlName="agreeToTerms" color="primary" id="reg-terms">
          I agree to the <a routerLink="/support" class="text-primary hover:underline">Terms of Service</a>
          and <a routerLink="/support" class="text-primary hover:underline">Privacy Policy</a>
        </mat-checkbox>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          class="w-full !h-12 !rounded-xl !text-[15px] !font-semibold mt-3 flex items-center justify-center"
          [disabled]="isLoading || registerForm.invalid"
          id="reg-submit"
        >
          @if (isLoading) { <mat-spinner diameter="20" /> } @else { Create Account }
        </button>

        @if (errorMessage) {
          <div class="flex items-center gap-2 p-3 sm:px-4 bg-red-50 border border-red-200 rounded-[10px] text-red-600 text-[13.5px] mt-2" role="alert">
            <mat-icon>error_outline</mat-icon>
            {{ errorMessage }}
          </div>
        }
      </form>

      <p class="text-center mt-5 text-sm text-stone-600">
        Already have an account?
        <a routerLink="/auth/login" class="text-primary font-semibold hover:underline">Sign in</a>
      </p>
    </div>
  `,
  styles: [],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirm = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName:       ['', Validators.required],
        lastName:        ['', Validators.required],
        email:           ['', [Validators.required, Validators.email]],
        phone:           [''],
        password:        ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        agreeToTerms:    [false, Validators.requiredTrue],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Account created successfully! Welcome to Nisha Pure Oils.', 'Registration Successful');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Registration failed. Please try again.';
      },
    });
  }
}
