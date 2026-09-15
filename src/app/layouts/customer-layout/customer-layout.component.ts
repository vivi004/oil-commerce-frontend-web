import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-[var(--color-bg,#fcfbf8)]">
      <!-- Mobile Overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black/50 z-[199] backdrop-blur-[2px] animate-fade-in" role="button" tabindex="0" aria-label="Close sidebar" (click)="closeSidebar()" (keydown.enter)="closeSidebar()" (keydown.escape)="closeSidebar()"></div>
      }

      <!-- Sidebar -->
      <app-sidebar
        [isOpen]="sidebarOpen()"
        (closeEvent)="closeSidebar()"
      />

      <!-- Main content area -->
      <div class="flex-1 flex flex-col min-w-0 transition-[margin-left] duration-300">
        <!-- Header -->
        <app-header
          (menuToggle)="toggleSidebar()"
        />

        <!-- Page content -->
        <main class="flex-1 min-w-0 w-full">
          <router-outlet />
        </main>

        <!-- Footer -->
        <app-footer />
      </div>
    </div>
  `,
  styles: [],
})
export class CustomerLayoutComponent {
  readonly sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const w = (event.target as Window).innerWidth;
    if (w >= 1280) {
      this.sidebarOpen.set(false);
    }
  }
}
