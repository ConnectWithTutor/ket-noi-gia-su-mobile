export function toLocaleStringVND(amount: string | number | null | undefined): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
    return '0 ₫';
  }
  return numericAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}