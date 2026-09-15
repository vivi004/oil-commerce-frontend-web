import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * passwordMatchValidator — cross-field validator ensuring password === confirmPassword.
 * Apply to the FormGroup level.
 */
export function passwordMatchValidator(
  passwordField = 'password',
  confirmField  = 'confirmPassword',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirm  = control.get(confirmField);
    if (!password || !confirm) return null;
    if (password.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    if (confirm.errors) {
      delete confirm.errors['passwordMismatch'];
      if (Object.keys(confirm.errors).length === 0) {
        confirm.setErrors(null);
      }
    }
    return null;
  };
}

/**
 * phoneValidator — validates Indian phone number format.
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const pattern = /^(\+91[-\s]?)?[6-9]\d{9}$/;
    return pattern.test(control.value.replace(/\s/g, ''))
      ? null
      : { invalidPhone: true };
  };
}

/**
 * noWhitespaceValidator — ensures field is not only whitespace.
 */
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return (control.value as string).trim().length === 0
      ? { whitespace: true }
      : null;
  };
}

/**
 * fileSizeValidator — validates uploaded file size.
 */
export function fileSizeValidator(maxSizeBytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;
    if (!file) return null;
    return file.size > maxSizeBytes
      ? { fileSize: { max: maxSizeBytes, actual: file.size } }
      : null;
  };
}
