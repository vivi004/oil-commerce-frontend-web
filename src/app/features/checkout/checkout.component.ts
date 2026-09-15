import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ShippingAddress } from '../../core/models/order.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatStepperModule, MatFormFieldModule, MatInputModule, MatRadioModule,
    MatDividerModule, EmptyStateComponent
  ],
  template: `
    <div class="page-container section-padding">
      <div class="mb-8">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Final Step</span>
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 m-0">Secure Mill Checkout</h1>
      </div>

      @if (cartService.items().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-10 items-start">
          <!-- Multi-Step Checkout Form -->
          <div class="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-8 shadow-xs">
            <mat-stepper orientation="vertical" linear #stepper>
              <!-- Step 1: Shipping Address -->
              <mat-step label="1. Delivery Address" [stepControl]="addressForm">
                <form [formGroup]="addressForm" class="py-4 flex flex-col gap-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <mat-form-field appearance="outline">
                      <mat-label>Full Name</mat-label>
                      <input matInput formControlName="fullName" placeholder="e.g. Ramesh Kumar" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Phone Number (10 digits)</mat-label>
                      <input matInput formControlName="phone" placeholder="98421 88990" />
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Delivery Street Address / Door No.</mat-label>
                    <input matInput formControlName="addressLine1" placeholder="Plot / Flat, Street, Landmark" />
                  </mat-form-field>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <mat-form-field appearance="outline">
                      <mat-label>City / Town</mat-label>
                      <input matInput formControlName="city" placeholder="Erode / Chennai" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>State</mat-label>
                      <input matInput formControlName="state" placeholder="Tamil Nadu" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>PIN Code</mat-label>
                      <input matInput formControlName="postalCode" placeholder="638107" />
                    </mat-form-field>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3 mt-2">
                    <button mat-raised-button color="primary" matStepperNext [disabled]="addressForm.invalid" class="!h-11 !px-7 !rounded-full !font-bold w-full sm:w-auto">
                      Continue to Payment Method →
                    </button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 2: Payment Method -->
              <mat-step label="2. Payment Details">
                <div class="py-4 flex flex-col gap-5">
                  <mat-radio-group
                    [value]="paymentMethod()"
                    (change)="paymentMethod.set($event.value)"
                    class="flex flex-col gap-3"
                  >
                    @for (method of paymentMethods; track method.id) {
                      <label
                        class="flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200"
                        [class.border-amber-700]="paymentMethod() === method.id"
                        [class.bg-amber-50/80]="paymentMethod() === method.id"
                        [class.border-stone-200]="paymentMethod() !== method.id"
                      >
                        <mat-radio-button [value]="method.id" color="primary">
                          <span class="text-xl mr-2">{{ method.icon }}</span>
                          <span class="text-sm font-bold text-stone-800">{{ method.label }}</span>
                        </mat-radio-button>
                      </label>
                    }
                  </mat-radio-group>

                  <!-- Payment simulation card -->
                  @if (paymentMethod() === 'upi') {
                    <div class="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col gap-2.5">
                      <div class="text-xs font-bold text-amber-800">📱 Fast UPI QR / VPA Instant Payment</div>
                      <input type="text" value="Scan QR on next screen or pay via GPay/PhonePe" class="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono outline-none" readonly />
                    </div>
                  } @else if (paymentMethod() === 'card') {
                    <div class="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col gap-3">
                      <div class="text-xs font-bold text-amber-800">💳 RuPay, Visa, MasterCard Secure Gateway</div>
                      <input type="text" placeholder="Card Number: 4532 •••• •••• 8890" class="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono outline-none" readonly />
                      <div class="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY: 08/28" class="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono outline-none" readonly />
                        <input type="text" placeholder="CVV: 890" class="bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono outline-none" readonly />
                      </div>
                    </div>
                  }

                  <div class="flex flex-col sm:flex-row gap-3 mt-2">
                    <button mat-button matStepperPrevious class="w-full sm:w-auto !font-bold">Back</button>
                    <button mat-raised-button color="primary" matStepperNext class="!h-11 !px-7 !rounded-full !font-bold w-full sm:w-auto">Review &amp; Place Order →</button>
                  </div>
                </div>
              </mat-step>

              <!-- Step 3: Review & Place Order -->
              <mat-step label="3. Final Review">
                <div class="py-4">
                  <div class="bg-stone-50 border border-stone-200 rounded-2xl p-5 sm:p-6 mb-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Delivery Destination:</h4>
                    <p class="text-sm leading-relaxed text-stone-900 m-0">
                      <strong>{{ addressForm.value.fullName }}</strong><br />
                      {{ addressForm.value.addressLine1 }}, {{ addressForm.value.city }}, {{ addressForm.value.state }} - {{ addressForm.value.postalCode }}<br />
                      Phone: <span class="font-bold text-amber-900">{{ addressForm.value.phone }}</span>
                    </p>

                    <mat-divider class="!my-4" />

                    <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Payment Mode:</h4>
                    <p class="text-sm font-bold text-stone-900 m-0">
                      {{ getSelectedPaymentLabel() }}
                    </p>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3">
                    <button mat-button matStepperPrevious class="w-full sm:w-auto !font-bold">Back</button>
                    <button
                      mat-raised-button
                      color="primary"
                      (click)="placeOrder()"
                      [disabled]="isPlacingOrder"
                      class="!h-13 !px-8 !rounded-full !font-bold !text-base w-full sm:w-auto shadow-md shadow-amber-900/30"
                    >
                      <mat-icon class="mr-1.5">verified</mat-icon>
                      <span>{{ isPlacingOrder ? 'Processing...' : 'Confirm & Place Order (₹' + cartService.total() + ')' }}</span>
                    </button>
                  </div>
                </div>
              </mat-step>
            </mat-stepper>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs sticky top-28">
            <h3 class="font-['Outfit',sans-serif] text-xl font-extrabold text-stone-900 m-0">Order Items ({{ cartService.itemCount() }})</h3>
            <mat-divider class="!my-4" />

            <div class="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
              @for (item of cartService.items(); track item.id) {
                <div class="flex items-center gap-3.5">
                  <img [src]="item.product.thumbnail" [alt]="item.product.name" class="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50" />
                  <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span class="text-sm font-bold text-stone-900 truncate">{{ item.product.name }}</span>
                    @if (item.selectedVariantLabel) {
                      <span class="text-xs font-bold text-amber-800">Variant: {{ item.selectedVariantLabel }}</span>
                    }
                    <span class="text-xs text-stone-500">Qty: {{ item.quantity }} × ₹{{ item.unitPrice }}</span>
                  </div>
                  <span class="text-sm font-extrabold text-stone-900">₹{{ item.totalPrice }}</span>
                </div>
              }
            </div>

            <mat-divider class="!my-4" />

            <div class="space-y-2.5 text-sm text-stone-600">
              <div class="flex justify-between"><span>Subtotal</span><span class="font-bold text-stone-900">₹{{ cartService.subtotal() }}</span></div>
              @if (cartService.discountAmount() > 0) {
                <div class="flex justify-between text-emerald-700 font-bold"><span>Discount (Coupon)</span><span>-₹{{ cartService.discountAmount() }}</span></div>
              }
              <div class="flex justify-between">
                <span>Delivery Charges</span>
                <span class="font-bold text-emerald-700">{{ cartService.shippingCost() === 0 ? 'FREE' : '₹' + cartService.shippingCost() }}</span>
              </div>
              <div class="flex justify-between"><span>GST (5%)</span><span class="font-bold text-stone-900">₹{{ cartService.taxAmount() }}</span></div>
            </div>

            <mat-divider class="!my-4" />

            <div class="flex justify-between items-center my-3 text-stone-900">
              <span class="font-bold text-base">Total Amount</span>
              <span class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-700">₹{{ cartService.total() }}</span>
            </div>
            <p class="text-xs text-stone-400 mt-4 text-center flex items-center justify-center gap-1.5">
              <mat-icon class="!text-sm !w-4 !h-4">lock</mat-icon>
              <span>Safe 256-Bit Encrypted Indian Banking Gateway</span>
            </p>
          </div>
        </div>
      } @else {
        <app-empty-state
          emoji="🛢️"
          title="No items to checkout"
          description="Your cart is currently empty. Please select cold-pressed oils or traditional snacks to checkout."
          actionText="Browse Pure Oils"
          actionLink="/products"
        />
      }
    </div>
  `,
  styles: [],
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  readonly paymentMethod = signal('upi');
  isPlacingOrder = false;

  readonly paymentMethods = [
    { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: '📱' },
    { id: 'card', label: 'Debit / Credit Card (RuPay, Visa, MC)', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking (SBI, HDFC, ICICI, Canara)', icon: '🏦' },
    { id: 'cod', label: 'Cash on Delivery (Pay at Doorstep)', icon: '💵' },
  ];

  addressForm!: FormGroup;

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      fullName:     ['Ramesh Kumar', Validators.required],
      phone:        ['9842188990', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      addressLine1: ['124/A, Mill Gate Road, Gandhipuram', Validators.required],
      city:         ['Erode', Validators.required],
      state:        ['Tamil Nadu', Validators.required],
      postalCode:   ['638107', Validators.required],
    });
  }

  getSelectedPaymentLabel(): string {
    const found = this.paymentMethods.find((p) => p.id === this.paymentMethod());
    return found ? `${found.icon} ${found.label}` : 'UPI';
  }

  placeOrder(): void {
    if (this.addressForm.invalid) {
      this.toastr.warning('Please complete all delivery address fields.');
      return;
    }

    if (this.cartService.items().length === 0) {
      this.toastr.error('Your cart is empty.');
      return;
    }

    this.isPlacingOrder = true;
    const shippingAddress: ShippingAddress = {
      fullName: this.addressForm.value.fullName,
      phone: this.addressForm.value.phone,
      addressLine1: this.addressForm.value.addressLine1,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      postalCode: this.addressForm.value.postalCode,
      country: 'India',
      isDefault: true,
    };

    setTimeout(() => {
      this.orderService
        .placeOrder({
          items: this.cartService.items(),
          subtotal: this.cartService.subtotal(),
          shippingCost: this.cartService.shippingCost(),
          taxAmount: this.cartService.taxAmount(),
          discountAmount: this.cartService.discountAmount(),
          couponCode: this.cartService.couponCode() ?? undefined,
          total: this.cartService.total(),
          shippingAddress,
          paymentMethod: this.getSelectedPaymentLabel(),
        })
        .subscribe((order) => {
          this.cartService.clearCart();
          this.isPlacingOrder = false;
          this.toastr.success(`Order #${order.orderNumber} placed successfully!`, 'Order Confirmed! 🎉');
          this.router.navigate(['/order-success']);
        });
    }, 1000);
  }
}
