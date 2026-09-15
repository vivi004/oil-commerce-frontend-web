import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[var(--color-bg)]">
      <!-- Hero Header -->
      <section class="bg-gradient-to-br from-[#180e06] via-[#3d1f08] to-[#6b2c07] text-white py-16 sm:py-24 px-4">
        <div class="page-container text-center">
          <span class="inline-block text-xs font-extrabold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-4 py-1.5 rounded-full mb-3.5 tracking-wider uppercase backdrop-blur-md">
            GET IN TOUCH
          </span>
          <h1 class="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight text-white" style="color: #ffffff !important;">
            Contact Nisha Pure Oils Mill &amp; Sales Desk
          </h1>
          <p class="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about our wood pressing methods, bulk 15L tin orders, or dealership opportunities? Our team in Kangeyam is here to help.
          </p>
        </div>
      </section>

      <!-- Contact Details & Form Grid -->
      <section class="section-padding">
        <div class="page-container">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <!-- Left 5 cols: Info Cards -->
            <div class="lg:col-span-5 flex flex-col">
              <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1.5">Mill &amp; Head Office</span>
              <h2 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900 mb-6 tracking-tight">Reach Our Factory Team</h2>

              <div class="flex flex-col gap-4">
                <div class="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 transition-all hover:border-amber-600 hover:shadow-sm">
                  <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">📍</div>
                  <div>
                    <strong class="text-sm font-bold text-stone-900 block mb-1">Mill &amp; Factory Address</strong>
                    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed m-0">
                      Nisha Pure Oils &amp; Agro Industries<br />
                      Kangeyam Main Road, Near Reliance Petrol Bunk,<br />
                      Erode District, Tamil Nadu — 638107, India
                    </p>
                  </div>
                </div>

                <div class="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 transition-all hover:border-amber-600 hover:shadow-sm">
                  <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">📞</div>
                  <div>
                    <strong class="text-sm font-bold text-stone-900 block mb-1">Customer Helpline &amp; Orders</strong>
                    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed m-0">
                      <a href="tel:+919842188990" class="text-amber-800 font-bold hover:underline">+91 98421 88990</a> (Direct Mill Desk)<br />
                      <a href="tel:+919876543210" class="text-amber-800 font-bold hover:underline">+91 98765 43210</a> (Wholesale &amp; Tins)
                    </p>
                  </div>
                </div>

                <div class="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 transition-all hover:border-amber-600 hover:shadow-sm">
                  <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">✉️</div>
                  <div>
                    <strong class="text-sm font-bold text-stone-900 block mb-1">Email Support</strong>
                    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed m-0">
                      <a href="mailto:care@nishapureoils.com" class="text-amber-800 font-bold hover:underline">care&#64;nishapureoils.com</a><br />
                      <a href="mailto:sales@nishapureoils.com" class="text-amber-800 font-bold hover:underline">sales&#64;nishapureoils.com</a>
                    </p>
                  </div>
                </div>

                <div class="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 transition-all hover:border-amber-600 hover:shadow-sm">
                  <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">⏰</div>
                  <div>
                    <strong class="text-sm font-bold text-stone-900 block mb-1">Operating Hours</strong>
                    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed m-0">
                      Monday to Saturday: 8:00 AM – 7:30 PM<br />
                      Sunday: Closed (Maintenance &amp; Wood Churn Seasoning)
                    </p>
                  </div>
                </div>
              </div>

              <!-- WhatsApp Quick Action -->
              <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mt-6 shadow-xs">
                <strong class="text-emerald-950 block text-base mb-1 font-bold">Instant WhatsApp Ordering</strong>
                <p class="text-emerald-800 text-xs sm:text-sm mb-4 leading-relaxed">Chat with our sales team or request current crop harvest pricing.</p>
                <a
                  href="https://wa.me/919842188990?text=Hello%20Nisha%20Pure%20Oils,%20I%20would%20like%20to%20inquire%20about%20your%20products"
                  target="_blank"
                  class="inline-flex items-center gap-2 bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full no-underline hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  <span>💬 Chat on WhatsApp (+91 98421 88990)</span>
                </a>
              </div>
            </div>

            <!-- Right 7 cols: Inquiry Form -->
            <div class="lg:col-span-7">
              <div class="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
                <h3 class="font-['Outfit',sans-serif] text-2xl font-extrabold text-stone-900 mb-2">Send Us an Inquiry</h3>
                <p class="text-xs sm:text-sm text-stone-500 mb-8">Fill in your details below and our sales desk will respond within 2 hours.</p>

                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label for="name" class="text-xs font-bold text-stone-700 uppercase tracking-wider">Your Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      formControlName="name"
                      placeholder="e.g. Ramesh Kumar"
                      class="h-11 border border-stone-300 rounded-xl px-4 text-xs sm:text-sm outline-none bg-stone-50 focus:bg-white focus:border-amber-700 transition-all font-medium"
                      [class.!border-red-500]="f['name'].touched && f['name'].invalid"
                    />
                    @if (f['name'].touched && f['name'].invalid) {
                      <span class="text-xs text-red-600 font-semibold">Please enter your name</span>
                    }
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label for="phone" class="text-xs font-bold text-stone-700 uppercase tracking-wider">Phone Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        formControlName="phone"
                        placeholder="e.g. 98421 88990"
                        class="h-11 border border-stone-300 rounded-xl px-4 text-xs sm:text-sm outline-none bg-stone-50 focus:bg-white focus:border-amber-700 transition-all font-medium"
                        [class.!border-red-500]="f['phone'].touched && f['phone'].invalid"
                      />
                      @if (f['phone'].touched && f['phone'].invalid) {
                        <span class="text-xs text-red-600 font-semibold">Valid 10-digit mobile required</span>
                      }
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="email" class="text-xs font-bold text-stone-700 uppercase tracking-wider">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        formControlName="email"
                        placeholder="e.g. name@example.com"
                        class="h-11 border border-stone-300 rounded-xl px-4 text-xs sm:text-sm outline-none bg-stone-50 focus:bg-white focus:border-amber-700 transition-all font-medium"
                        [class.!border-red-500]="f['email'].touched && f['email'].invalid"
                      />
                      @if (f['email'].touched && f['email'].invalid) {
                        <span class="text-xs text-red-600 font-semibold">Valid email address required</span>
                      }
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label for="inquiryType" class="text-xs font-bold text-stone-700 uppercase tracking-wider">Inquiry Purpose *</label>
                    <select id="inquiryType" formControlName="inquiryType" class="h-11 border border-stone-300 rounded-xl px-3.5 text-xs sm:text-sm outline-none bg-stone-50 focus:bg-white focus:border-amber-700 font-medium">
                      <option value="retail">Family &amp; Home Kitchen Order</option>
                      <option value="wholesale_tins">Wholesale 15L Commercial Tins</option>
                      <option value="oil_cake">Cattle Feed Oil Cake Bulk Truckload</option>
                      <option value="temple_pooja">Temple / Religious Trust Deepam Oils</option>
                      <option value="dealership">Dealership / Distributorship</option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label for="message" class="text-xs font-bold text-stone-700 uppercase tracking-wider">Your Message / Product Requirements *</label>
                    <textarea
                      id="message"
                      rows="4"
                      formControlName="message"
                      placeholder="Specify product types, required sizes (e.g. 1L, 5L, 15L, 5Kg), and delivery city..."
                      class="border border-stone-300 rounded-xl p-3.5 text-xs sm:text-sm outline-none bg-stone-50 focus:bg-white focus:border-amber-700 resize-y font-medium"
                      [class.!border-red-500]="f['message'].touched && f['message'].invalid"
                    ></textarea>
                    @if (f['message'].touched && f['message'].invalid) {
                      <span class="text-xs text-red-600 font-semibold">Please enter your message</span>
                    }
                  </div>

                  <button
                    type="submit"
                    mat-raised-button
                    color="primary"
                    [disabled]="contactForm.invalid || isSubmitting"
                    class="w-full !h-13 !rounded-full !font-bold !text-base mt-3 shadow-md shadow-amber-900/20"
                  >
                    {{ isSubmitting ? 'Sending...' : 'Submit Inquiry to Mill Desk' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class ContactComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  isSubmitting = false;

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    inquiryType: ['retail', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.toastr.success(
        'Thank you! Your inquiry has been sent to our Kangeyam mill desk. We will call you back shortly.',
        'Inquiry Received',
        { timeOut: 6000 },
      );
      this.contactForm.reset({ inquiryType: 'retail' });
    }, 1000);
  }
}
