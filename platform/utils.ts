export type Currency = "USD" | "INR";

export const toRoundCurrencyString = (
  amount: number | undefined,
  currency: Currency,
  includeSign = false
) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const value = amount ?? 0;
  const ret = currencyFormatter.format(value / 100);

  console.log(ret, value);
  return includeSign && value ? `+${ret}` : ret;
};
