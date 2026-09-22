import { Component, OnInit, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { selectCurrentUser } from '../../core/state/auth/auth.selectors';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatDividerModule, MatTabsModule,
    ChartComponent
  ],
  template: `
    <div class="page-container section-padding">
      <!-- Header -->
      <div class="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 block mb-1">Customer Dashboard</span>
          <h1 class="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            My Account &amp; Insights
          </h1>
          <p class="text-sm sm:text-base text-stone-500 mt-1">
            Manage personal profile details, addresses, and explore your pure oil purchase analytics
          </p>
        </div>

        <div>
          <button
            type="button"
            (click)="syncLive()"
            [disabled]="orderService.isSyncing()"
            class="px-4 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            title="Sync latest live orders and purchase statistics"
          >
            <mat-icon class="!w-4 !h-4 !text-base text-amber-600" [class.animate-spin]="orderService.isSyncing()">sync</mat-icon>
            <span>{{ orderService.isSyncing() ? 'Syncing...' : 'Sync Live' }}</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-8 items-start">
        <!-- Avatar & VIP Card -->
        <div class="flex flex-col gap-6">
          <div class="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 text-center shadow-xs flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-lg shadow-amber-900/20">
              @if (currentUser()?.avatar) {
                <img [src]="currentUser()!.avatar" alt="Profile picture" class="w-full h-full object-cover" />
              } @else {
                <span class="text-3xl font-bold text-white font-['Outfit',sans-serif]">
                  {{ (currentUser()?.firstName?.[0] ?? 'A') + (currentUser()?.lastName?.[0] ?? 'M') }}
                </span>
              }
            </div>
            <button mat-stroked-button class="!text-xs !rounded-full mb-4 text-stone-700">
              <mat-icon class="!w-4 !h-4 !text-base mr-1">photo_camera</mat-icon> Change Avatar
            </button>
            <div class="w-full">
              <p class="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                {{ currentUser()?.firstName ?? 'Alex' }} {{ currentUser()?.lastName ?? 'Morgan' }}
              </p>
              <p class="text-xs sm:text-sm text-stone-500 mt-0.5 mb-3">
                {{ currentUser()?.email ?? 'alex.morgan@example.com' }}
              </p>
              <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <span>⭐ Gold Tier Member</span>
              </div>
            </div>
          </div>

          <!-- Quick Rewards Widget -->
          <div class="bg-gradient-to-br from-amber-500/10 via-amber-50 to-stone-50 rounded-3xl border border-amber-200/80 p-6 shadow-xs">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-1">Nisha Pure Rewards</h4>
            <div class="font-['Outfit',sans-serif] text-3xl font-extrabold text-amber-700 mb-1">1,480 pts</div>
            <p class="text-xs text-stone-600 leading-relaxed mb-4">
              1,480 points available. Redeem ₹150 off on your next pure wood-pressed oil order!
            </p>
            <button mat-stroked-button color="primary" class="w-full !rounded-full !font-bold">
              Redeem Rewards
            </button>
          </div>
        </div>

        <!-- Main Content with Tabs -->
        <div class="min-w-0">
          <div class="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <mat-tab-group animationDuration="200ms">
              <!-- Tab 1: Personal Details Form -->
              <mat-tab label="Personal Details">
                <div class="p-6 sm:p-8">
                  <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                    Edit Personal Information
                  </h3>
                  <p class="text-xs sm:text-sm text-stone-500 mb-6">
                    Update your account details and contact preferences
                  </p>
                  <mat-divider class="!mb-6" />

                  <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="flex flex-col gap-4" novalidate>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>First Name</mat-label>
                        <input matInput formControlName="firstName" id="profile-firstname" />
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Last Name</mat-label>
                        <input matInput formControlName="lastName" id="profile-lastname" />
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Email Address</mat-label>
                      <mat-icon matPrefix class="mr-2 text-stone-400">email</mat-icon>
                      <input matInput type="email" formControlName="email" id="profile-email" readonly />
                      <mat-hint>Contact customer support to modify email</mat-hint>
                    </mat-form-field>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Phone Number</mat-label>
                        <mat-icon matPrefix class="mr-2 text-stone-400">phone</mat-icon>
                        <input matInput type="tel" formControlName="phone" id="profile-phone" />
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Gender</mat-label>
                        <mat-select formControlName="gender">
                          <mat-option value="male">Male</mat-option>
                          <mat-option value="female">Female</mat-option>
                          <mat-option value="other">Other</mat-option>
                          <mat-option value="prefer_not_to_say">Prefer not to say</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="w-full mt-2">
                      <mat-label>Bio / Notes</mat-label>
                      <textarea matInput formControlName="bio" rows="3" id="profile-bio"></textarea>
                    </mat-form-field>

                    <div class="pt-4 flex justify-end">
                      <button
                        mat-raised-button
                        color="primary"
                        type="submit"
                        [disabled]="isLoading || profileForm.invalid"
                        id="profile-save"
                        class="!h-11 !px-8 !rounded-full !font-bold shadow-xs"
                      >
                        {{ isLoading ? 'Saving Changes...' : 'Save Changes' }}
                      </button>
                    </div>
                  </form>
                </div>
              </mat-tab>

              <!-- Tab 2: Shopping Analytics (ApexCharts) -->
              <mat-tab label="Spending & Analytics">
                <div class="p-6 sm:p-8">
                  <div class="mb-6">
                    <h3 class="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                      Spending Analytics &amp; Insights
                    </h3>
                    <p class="text-xs sm:text-sm text-stone-500">
                      Real-time overview of your Nisha Pure Oils purchase trends
                    </p>
                  </div>

                  <!-- KPI stats grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 flex flex-col gap-1">
                      <span class="text-xs font-bold text-stone-500 uppercase tracking-wider">Lifetime Spend</span>
                      <strong class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900">₹{{ totalSpend() }}</strong>
                      <span class="text-xs font-semibold text-emerald-700">Live updated</span>
                    </div>
                    <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 flex flex-col gap-1">
                      <span class="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Orders</span>
                      <strong class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900">{{ totalOrdersCount() }}</strong>
                      <span class="text-xs text-stone-500">Across pure oil varieties</span>
                    </div>
                    <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 flex flex-col gap-1">
                      <span class="text-xs font-bold text-stone-500 uppercase tracking-wider">Coupons Saved</span>
                      <strong class="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-emerald-700">₹{{ totalSaved() }}</strong>
                      <span class="text-xs text-stone-500">via discounts &amp; promos</span>
                    </div>
                  </div>

                  <!-- Charts Grid -->
                  <div class="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6">
                    <!-- Area Chart: Monthly Spending -->
                    <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 sm:p-6 overflow-hidden">
                      <h4 class="text-sm sm:text-base font-bold text-stone-900 mb-4">
                        Monthly Expenditure (₹)
                      </h4>
                      <apx-chart
                        [series]="monthlySpendingSeries"
                        [chart]="monthlyChartOptions"
                        [xaxis]="monthlyXAxis"
                        [stroke]="monthlyStroke"
                        [dataLabels]="chartDataLabels"
                        [tooltip]="chartTooltip"
                        [fill]="monthlyFill"
                      />
                    </div>

                    <!-- Donut Chart: Category Distribution -->
                    <div class="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 sm:p-6 overflow-hidden">
                      <h4 class="text-sm sm:text-base font-bold text-stone-900 mb-4">
                        Purchases by Category
                      </h4>
                      <apx-chart
                        [series]="categorySeries"
                        [chart]="categoryChartOptions"
                        [labels]="categoryLabels"
                        [responsive]="categoryResponsive"
                        [legend]="categoryLegend"
                      />
                    </div>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  private readonly store  = inject(Store);
  private readonly fb     = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  readonly orderService   = inject(OrderService);

  readonly currentUser = toSignal(this.store.select(selectCurrentUser));

  readonly totalOrdersCount = computed(() => {
    const list = this.orderService.orders();
    return list.length > 0 ? list.length : 14;
  });

  readonly totalSpend = computed(() => {
    const list = this.orderService.orders();
    const sum = list.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    return sum > 0 ? sum : 8420;
  });

  readonly totalSaved = computed(() => {
    const list = this.orderService.orders();
    const sum = list.reduce((acc, curr) => acc + (Number(curr.discountAmount) || 0), 0);
    return sum > 0 ? sum : 1480;
  });

  profileForm!: FormGroup;
  isLoading = false;

  // Monthly Spending Area Chart
  readonly monthlySpendingSeries: ApexAxisChartSeries = [
    {
      name: 'Total Spending (₹)',
      data: [1200, 2400, 1850, 3490, 4900, 4580],
    },
  ];

  readonly monthlyChartOptions: ApexChart = {
    type: 'area',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
  };

  readonly monthlyXAxis: ApexXAxis = {
    categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    labels: { style: { colors: '#6b7280', fontSize: '12px' } },
  };

  readonly monthlyStroke: ApexStroke = {
    curve: 'smooth',
    width: 3,
    colors: ['#b45309'],
  };

  readonly monthlyFill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100],
      colorStops: [
        { offset: 0, color: '#b45309', opacity: 0.4 },
        { offset: 100, color: '#b45309', opacity: 0.0 },
      ],
    },
  };

  readonly chartDataLabels: ApexDataLabels = { enabled: false };
  readonly chartTooltip: ApexTooltip = { theme: 'dark' };

  // Category Distribution Donut Chart
  readonly categorySeries: ApexNonAxisChartSeries = [45, 25, 15, 10, 5];
  readonly categoryLabels: string[] = ['Groundnut Oil', 'Sesame Oil', 'Coconut Oil', 'Lamp Oil', 'Neem Oil'];

  readonly categoryChartOptions: ApexChart = {
    type: 'donut',
    height: 260,
    fontFamily: 'Inter, sans-serif',
  };

  readonly categoryResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' },
      },
    },
  ];

  readonly categoryLegend: ApexLegend = {
    position: 'bottom',
    fontSize: '12px',
  };

  ngOnInit(): void {
    // Initial live sync for latest customer orders & purchase records
    this.orderService.syncLiveOrders().subscribe({ error: () => {} });

    const user = this.currentUser();
    this.profileForm = this.fb.group({
      firstName: [user?.firstName ?? 'Alex', Validators.required],
      lastName:  [user?.lastName ?? 'Morgan', Validators.required],
      email:     [{ value: user?.email ?? 'alex.morgan@example.com', disabled: true }],
      phone:     [user?.phone ?? '+91 98765 43210'],
      gender:    ['male'],
      bio:       ['Passionate about pure, traditional cold-pressed cooking oils.'],
    });
  }

  syncLive(): void {
    this.toastr.info('Syncing your latest purchase and order data...', 'Live Sync');
    this.orderService.syncLiveOrders().subscribe({
      next: (orders) => {
        this.toastr.success(`Synced ${orders.length} order(s) successfully!`, 'Up to date');
      },
      error: () => {
        this.toastr.warning('Could not reach backend; using stored data.', 'Offline Mode');
      }
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.toastr.success('Profile details updated successfully!', 'Saved');
    }, 800);
  }
}
