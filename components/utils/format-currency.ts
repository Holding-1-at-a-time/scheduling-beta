/**
 * Formats a number into a currency string based on the provided locale and currency code.
 * 
 * @param amount - The numerical amount to format.
 * @param locale - (Optional) The locale string, e.g., 'en-US'. Defaults to the system locale.
 * @param currency - (Optional) The three-letter currency code, e.g., 'USD'. Defaults to 'USD'.
 * @returns A formatted currency string.
 */
export const formatCurrency = (
  amount: number,
  locale?: string,
  currency: string = 'USD'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toFixed(2);
  }
};
