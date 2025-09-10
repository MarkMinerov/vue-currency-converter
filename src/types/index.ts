import { CurrencyCode } from "~/composables/useCurrency";

export interface CurrencyConfig {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

export type ListParams = Partial<{
  itemsPerView: number;
  itemHeight: number;
  availableCurrencies: CurrencyCode[];
  animationName: string;
  item: {
    hideCode: boolean;
    hideName: boolean;
    hideSymbol: boolean;
  };
}>;

export type Size = "sm" | "md" | "lg" | "xl" | "xxl";
