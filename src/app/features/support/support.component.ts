import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-support',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  template: `
    <div class="page-container section-padding">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-start">
        <!-- Info Panel -->
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Customer Care Desk</span>
          <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
            Help &amp; Support
          </h1>
          <p class="text-sm sm:text-base text-stone-600 mb-6">
            Have a query about our traditional cold-pressing methods or an existing order? Our customer support team is here to assist you.
          </p>

          <div class="flex flex-col gap-3.5 mb-8">
            @for (contact of contactInfo; track contact.label) {
              <div class="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex items-center gap-4 shadow-xs">
                <div class="text-2xl sm:text-3xl">{{ contact.icon }}</div>
                <div>
                  <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider">{{ contact.label }}</h4>
                  <p class="text-sm sm:text-base font-bold text-stone-900 mt-0.5">{{ contact.value }}</p>
                </div>
              </div>
            }
          </div>

          <div>
            <h3 class="font-['Outfit',sans-serif] text-lg sm:text-xl font-bold text-stone-900 mb-4">Frequently Asked Questions</h3>
            @for (faq of faqs; track faq.q) {
              <details class="mb-3 border border-stone-200/90 rounded-2xl overflow-hidden bg-white shadow-xs group">
                <summary class="p-4 font-bold text-sm sm:text-base text-stone-900 cursor-pointer list-none select-none hover:text-amber-800 flex justify-between items-center">
                  <span>{{ faq.q }}</span>
                  <span class="text-stone-400 text-xs">▾</span>
                </summary>
                <p class="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                  {{ faq.a }}
                </p>
              </details>
            }
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
          <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-6">
            Send Us a Message
          </h3>

          <form [formGroup]="supportForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-3" novalidate>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Subject</mat-label>
              <mat-select formControlName="subject">
                @for (opt of subjects; track opt) {
                  <mat-option [value]="opt">{{ opt }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Order ID (optional)</mat-label>
              <input matInput formControlName="orderId" placeholder="#NPO-12345" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Message</mat-label>
              <textarea matInput formControlName="message" rows="5" placeholder="Describe your inquiry..." id="support-message"></textarea>
              @if (supportForm.get('message')?.hasError('minlength') && supportForm.get('message')?.touched) {
                <mat-error>Message must be at least 20 characters</mat-error>
              }
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="isLoading || supportForm.invalid"
              class="w-full !h-12 !rounded-full !font-bold text-base shadow-md shadow-amber-900/20 mt-2"
              id="support-submit"
            >
              <mat-icon class="mr-1.5">send</mat-icon> {{ isLoading ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SupportComponent {
  supportForm: FormGroup;
  isLoading = false;

  readonly subjects = ['Cold Pressed Oil Query', 'Order & Delivery Issue', 'Bulk Order Inquiry', 'Return & Refund', 'Payment Problem', 'Other'];

  readonly contactInfo = [
    { icon: '📧', label: 'Email Support', value: 'care@nishapureoils.com' },
    { icon: '📞', label: 'Phone / WhatsApp', value: '+91 98421 88990 (Mon-Sat 8AM-7:30PM)' },
    { icon: '🏭', label: 'Mill Address', value: 'Nisha Pure Oils, Kangeyam Road, Erode, Tamil Nadu' },
  ];

  readonly faqs = [
    { q: 'What is wood-pressed / cold-pressed oil?', a: 'Wood pressed (Marachekku) oil is extracted at room temperature below 40°C using solid Vaagai wooden pestles without adding chemical solvents or artificial heat, preserving 100% natural vitamins, healthy enzymes, and antioxidants.' },
    { q: 'How do I track my order?', a: 'Visit My Orders and click "Track Package" on any active order to monitor real-time shipping carrier updates.' },
    { q: 'What is the shelf life of cold-pressed oils?', a: 'Because our oils are 100% pure with zero added preservatives, we recommend consuming them within 6 to 12 months when stored in a cool, dry place away from direct sunlight.' },
    { q: 'Do you offer bulk wholesale supplies for Oil Cake or 15L commercial tins?', a: 'Yes, we supply bulk groundnut oil cake and sesame oil cake for dairy and cattle feed, as well as 15L food-grade commercial tins for restaurants and caterers. Please contact our sales desk.' },
  ];

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this.supportForm = this.fb.group({
      subject: ['', Validators.required],
      orderId: [''],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  onSubmit(): void {
    if (this.supportForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.toastr.success('Your message has been sent! We\'ll reply within 24 hours.', 'Message Sent');
      this.supportForm.reset();
    }, 1200);
  }
}
