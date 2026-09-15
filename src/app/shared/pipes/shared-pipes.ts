import { Pipe, PipeTransform } from '@angular/core';

/**
 * CurrencyFormatPipe — formats a number as Indian Rupee currency.
 * Usage: {{ price | currencyFormat }} → ₹1,299.00
 */
@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'INR', locale = 'en-IN'): string {
    if (value === null || value === undefined) return '₹0.00';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  }
}

/**
 * TruncatePipe — truncates text to a maximum length.
 * Usage: {{ longText | truncate:100 }}
 */
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = 100, ellipsis = '...'): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength).trimEnd() + ellipsis;
  }
}

/**
 * RelativeTimePipe — converts a date to relative time string.
 * Usage: {{ createdAt | relativeTime }} → "2 hours ago"
 */
@Pipe({ name: 'relativeTime', standalone: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    const now  = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr  = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWk  = Math.floor(diffDay / 7);
    const diffMo  = Math.floor(diffDay / 30);
    const diffYr  = Math.floor(diffDay / 365);

    if (diffSec < 60)  return 'just now';
    if (diffMin < 60)  return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffHr  < 24)  return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    if (diffDay < 7)   return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    if (diffWk  < 4)   return `${diffWk} week${diffWk === 1 ? '' : 's'} ago`;
    if (diffMo  < 12)  return `${diffMo} month${diffMo === 1 ? '' : 's'} ago`;
    return `${diffYr} year${diffYr === 1 ? '' : 's'} ago`;
  }
}
