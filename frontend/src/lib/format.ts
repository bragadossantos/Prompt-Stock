/**
 * Formats a monetary amount consistently across the app using the pt-AO locale,
 * always with exactly two decimal places, followed by the currency code.
 *
 * Example: formatCurrency(1500) -> "1.500,00 AOA"
 *          formatCurrency(1500.5, "USD") -> "1.500,50 USD"
 */
export function formatCurrency(amount: number, currency: string = "AOA"): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = safeAmount.toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${currency}`;
}
