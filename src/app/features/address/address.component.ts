import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { ShippingAddress } from '../../core/models/order.model';

interface SavedAddress extends ShippingAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

@Component({
  selector: 'app-address',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule
  ],
  template: `
    <div class="page-container section-padding">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Account Management</span>
          <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Address Book
          </h1>
          <p class="text-sm sm:text-base text-stone-500 mt-1">
            Manage your delivery destinations for fast and seamless checkout
          </p>
        </div>
        @if (!showAddForm()) {
          <button
            mat-raised-button
            color="primary"
            (click)="showAddForm.set(true)"
            class="!h-11 !px-6 !rounded-full !font-bold shadow-xs self-start sm:self-auto"
          >
            <mat-icon class="mr-1.5 !text-base">add</mat-icon> Add New Address
          </button>
        }
      </div>

      <!-- Add Address Form Card -->
      @if (showAddForm()) {
        <div class="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 max-w-2xl mb-10 shadow-xs animate-fade-in">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-['Outfit',sans-serif] text-xl font-bold text-stone-900 m-0">
              Add Delivery Address
            </h3>
            <button mat-icon-button (click)="showAddForm.set(false)" aria-label="Close">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <form [formGroup]="addressForm" (ngSubmit)="onSaveAddress()" class="flex flex-col gap-4" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" placeholder="e.g. Ramesh Kumar" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="98421 88990" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Street Address / House No.</mat-label>
              <input matInput formControlName="addressLine1" placeholder="124/A Mill Gate Road, Gandhipuram" />
            </mat-form-field>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>City / Town</mat-label>
                <input matInput formControlName="city" placeholder="Erode" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" placeholder="Tamil Nadu" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>PIN Code</mat-label>
                <input matInput formControlName="postalCode" placeholder="638107" />
              </mat-form-field>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="addressForm.invalid"
                class="!h-11 !px-7 !rounded-full !font-bold shadow-xs"
              >
                Save Address
              </button>
              <button mat-button type="button" (click)="showAddForm.set(false)" class="!font-bold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Addresses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (addr of addresses(); track addr.id) {
          <div
            class="bg-white rounded-3xl border p-6 flex flex-col transition-all shadow-xs"
            [class.border-amber-700]="addr.isDefault"
            [class.ring-2]="addr.isDefault"
            [class.ring-amber-700/20]="addr.isDefault"
            [class.border-stone-200/90]="!addr.isDefault"
          >
            <div class="flex justify-between items-center mb-4">
              <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                {{ addr.label }}
              </span>
              @if (addr.isDefault) {
                <span class="text-amber-700 font-extrabold text-xs flex items-center gap-1">
                  ★ Default Address
                </span>
              }
            </div>

            <h3 class="font-['Outfit',sans-serif] text-base sm:text-lg font-bold text-stone-900 mb-2">
              {{ addr.fullName }}
            </h3>
            <p class="text-sm text-stone-600 mb-1">{{ addr.addressLine1 }}</p>
            <p class="text-sm text-stone-600 mb-1">{{ addr.city }}, {{ addr.state }} {{ addr.postalCode }}</p>
            <p class="text-xs sm:text-sm text-stone-500 mb-2">{{ addr.country }}</p>
            <p class="text-xs sm:text-sm text-stone-500 mb-6 font-medium">Phone: <strong class="text-stone-800">{{ addr.phone }}</strong></p>

            <div class="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
              @if (!addr.isDefault) {
                <button mat-button color="primary" (click)="setDefault(addr.id)" class="!text-xs sm:!text-sm !font-bold">
                  Set as Default
                </button>
              } @else {
                <span class="text-xs text-amber-800 font-bold">Primary Delivery Address</span>
              }
              <button mat-icon-button color="warn" (click)="deleteAddress(addr.id)" aria-label="Delete address">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AddressComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  readonly showAddForm = signal(false);

  readonly addresses = signal<SavedAddress[]>([
    {
      id: 'addr-1',
      label: 'Home',
      fullName: 'Ramesh Kumar',
      phone: '+91 98421 88990',
      addressLine1: '124/A, Mill Gate Road, Gandhipuram',
      city: 'Erode',
      state: 'Tamil Nadu',
      postalCode: '638107',
      country: 'India',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Work',
      fullName: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      addressLine1: '45, Industrial Estate, Kangeyam Road',
      city: 'Tiruppur',
      state: 'Tamil Nadu',
      postalCode: '641604',
      country: 'India',
      isDefault: false
    }
  ]);

  readonly addressForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    addressLine1: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required]
  });

  onSaveAddress(): void {
    if (this.addressForm.invalid) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: 'Other',
      fullName: this.addressForm.value.fullName,
      phone: this.addressForm.value.phone,
      addressLine1: this.addressForm.value.addressLine1,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      postalCode: this.addressForm.value.postalCode,
      country: 'India',
      isDefault: false
    };

    this.addresses.set([...this.addresses(), newAddr]);
    this.addressForm.reset();
    this.showAddForm.set(false);
    this.toastr.success('Address saved successfully!', 'Address Added');
  }

  setDefault(id: string): void {
    const updated = this.addresses().map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    this.addresses.set(updated);
    this.toastr.info('Default delivery address updated.');
  }

  deleteAddress(id: string): void {
    const updated = this.addresses().filter(a => a.id !== id);
    this.addresses.set(updated);
    this.toastr.info('Address removed.');
  }
}
