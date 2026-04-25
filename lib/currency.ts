export type Currency = "INR" | "USD";

export interface Pricing {
  amount: number;
  symbol: string;
  code: Currency;
}

export const getDisplayPrice = (inrAmount: number, targetCurrency: Currency): Pricing => {
  if (targetCurrency === "INR") {
    return { amount: inrAmount, symbol: "₹", code: "INR" };
  }

  // Fixed Premium International Pricing
  if (inrAmount === 399) return { amount: 4.99, symbol: "$", code: "USD" };
  if (inrAmount === 799) return { amount: 9.99, symbol: "$", code: "USD" };
  if (inrAmount === 999) return { amount: 12.99, symbol: "$", code: "USD" };

  // Fallback conversion (approx 1 USD = 83 INR)
  return { amount: Math.ceil((inrAmount / 83) - 0.01) + 0.99, symbol: "$", code: "USD" };
};

export const detectCurrency = async (): Promise<Currency> => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    if (data.country_code && data.country_code !== "IN") {
      return "USD";
    }
  } catch (e) {
    console.error("Currency detection failed:", e);
  }
  return "INR";
};
