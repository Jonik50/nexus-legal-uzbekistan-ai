
/**
 * Typography utilities for proper text formatting based on language
 */

/**
 * Formats Russian text with proper typography:
 * - Replaces standard quotes with Russian guillemets
 * - Replaces hyphens with em dashes where appropriate
 * - Fixes common typographic issues in Russian text
 */
export function formatRussianText(text: string): string {
  if (!text || typeof text !== "string") return text;
  
  return text
    // Replace quotes with guillemets (« »)
    // This is a simplified approach - for perfect quotes a more advanced parser would be needed
    .replace(/"([^"]+)"/g, '«$1»')
    
    // Replace double hyphens with em dash with proper spacing
    .replace(/\s--\s/g, ' — ')
    .replace(/\s-\s/g, ' — ')
    
    // Fix spacing around em dash according to Russian typographic rules
    .replace(/\s+—\s+/g, ' — ')
    
    // Fix multiple spaces
    .replace(/\s{2,}/g, ' ')
    
    // Ensure no space before punctuation marks
    .replace(/\s+([.,;:!?])/g, '$1');
}

/**
 * Formats price according to Russian/Uzbek conventions with proper space as thousands separator
 */
export function formatCurrencyRU(amount: number, currency: string = 'UZS'): string {
  if (isNaN(amount)) return '';
  
  // Format with Russian style (space as thousands separator, comma as decimal)
  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Add currency according to Russian convention (after the amount with space)
  return `${formattedAmount} ${currency}`;
}

/**
 * Ensures proper phone number formatting for CIS region:
 * Format: +998 XX XXX-XX-XX
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Format for Uzbekistan
  if (digits.startsWith("998") && digits.length === 12) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  
  // Basic formatting for other numbers
  return phone;
}

/**
 * Format date in Russian style: DD.MM.YYYY
 */
export function formatDateRU(date: Date | string): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}.${month}.${year}`;
}
