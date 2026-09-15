/**
 * Date Utilities
 */
export const DateUtils = {
  /** Format date to display string: "10 Sep 2026" */
  formatDisplay(date: string | Date): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(date));
  },

  /** Format datetime: "10 Sep 2026, 6:15 PM" */
  formatDateTime(date: string | Date): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(date));
  },

  /** Check if date is in the past */
  isPast(date: string | Date): boolean {
    return new Date(date) < new Date();
  },

  /** Add days to a date */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
};

/**
 * Format Utilities
 */
export const FormatUtils = {
  /** Format file size in human-readable form */
  fileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  },

  /** Format number with Indian number system (lakh, crore) */
  indianNumber(n: number): string {
    return n.toLocaleString('en-IN');
  },

  /** Format phone number for display */
  phone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  /** Generate initials from a name */
  initials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  },

  /** Slugify a string */
  slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
};

/**
 * Array Utilities
 */
export const ArrayUtils = {
  /** Chunk array into smaller arrays */
  chunk<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );
  },

  /** Remove duplicates by key */
  uniqueBy<T>(arr: T[], key: keyof T): T[] {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  },

  /** Group array by key */
  groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce(
      (groups, item) => {
        const groupKey = String(item[key]);
        return { ...groups, [groupKey]: [...(groups[groupKey] ?? []), item] };
      },
      {} as Record<string, T[]>,
    );
  },
};
