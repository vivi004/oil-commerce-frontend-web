import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RatingComponent } from '../../shared/components/rating/rating.component';

interface UserReview {
  id: string;
  productName: string;
  productImage: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
}

@Component({
  selector: 'app-reviews',
  imports: [RouterLink, MatButtonModule, MatIconModule, RatingComponent],
  template: `
    <div class="page-container section-padding">
      <!-- Header -->
      <div class="mb-8 sm:mb-10">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Customer Feedback</span>
        <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
          My Product Reviews
        </h1>
        <p class="text-sm sm:text-base text-stone-500 mt-1">
          Your feedback and ratings help families choose healthy, pure cold-pressed cooking oils
        </p>
      </div>

      <div class="flex flex-col gap-6">
        @for (rev of reviews(); track rev.id) {
          <div class="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
            <div class="flex items-center gap-4 pb-4 mb-4 border-b border-stone-100">
              <img [src]="rev.productImage" [alt]="rev.productName" class="w-16 h-16 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-200" />
              <div class="min-w-0">
                <span class="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  ✔ Verified Pure Purchase
                </span>
                <h4 class="text-base font-bold text-stone-900 truncate mt-0.5">
                  <a [routerLink]="['/products', rev.productId]" class="hover:text-amber-800 transition-colors no-underline text-stone-900">
                    {{ rev.productName }}
                  </a>
                </h4>
              </div>
              <span class="ml-auto text-xs text-stone-400 whitespace-nowrap hidden sm:block font-medium">{{ rev.date }}</span>
            </div>

            <div>
              <div class="flex items-center gap-3 mb-2">
                <app-rating [value]="rev.rating" [showValue]="false" />
                <h3 class="font-['Outfit',sans-serif] text-base sm:text-lg font-bold text-stone-900 m-0">{{ rev.title }}</h3>
              </div>
              <p class="text-sm text-stone-600 leading-relaxed mb-4">{{ rev.comment }}</p>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-stone-100 text-xs sm:text-sm text-stone-500 font-medium">
              <span class="flex items-center gap-1.5">👍 {{ rev.helpfulCount }} people found this helpful</span>
              <a mat-button color="primary" [routerLink]="['/products', rev.productId]" class="!text-xs sm:!text-sm !font-bold">
                View Product →
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class ReviewsComponent {
  readonly reviews = signal<UserReview[]>([
    {
      id: 'rev-1',
      productId: 'prod-groundnut-nisha',
      productName: 'Wood Pressed Groundnut Oil (Marachekku)',
      productImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=80',
      rating: 5,
      title: 'Incredible natural nutty aroma and pure clarity',
      comment: 'We have switched entirely to Nisha Pure Groundnut Oil for our everyday cooking and deep frying. The taste is remarkably pure, reminiscent of traditional village ghani oil. Absolutely top quality!',
      date: 'February 5, 2025',
      helpfulCount: 28
    },
    {
      id: 'rev-2',
      productId: 'prod-coconut-nisha',
      productName: 'Cold Pressed Virgin Coconut Oil',
      productImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=700&auto=format&fit=crop&q=80',
      rating: 5,
      title: 'Pristine virgin coconut oil, wonderful fragrance',
      comment: 'Zero artificial preservatives or chemicals. It smells like fresh sun-dried copra and works wonders for both authentic South Indian recipes and natural hair conditioning.',
      date: 'January 28, 2025',
      helpfulCount: 14
    }
  ]);
}
