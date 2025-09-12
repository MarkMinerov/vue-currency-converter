import { Ref } from "vue";
import { CurrencyCode } from "~/composables/useCurrency";

export interface CurrencyConfig {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: CurrencyCode;
  name_plural: string;
}

export type ListParams = {
  itemsPerView: number;
  itemHeight: number;
  availableCurrencies: CurrencyCode[];
  animationName: string;
  reverse: boolean;
  needFormat: boolean;
  openBlocked: boolean;
  item: {
    hideCode: boolean;
    hideName: boolean;
    hideSymbol: boolean;
  };
};

export interface CurrencyInputModel {
  currency: CurrencyCode;
  value: string;
}

export type ApiData = Partial<
  Record<CurrencyCode, Record<CurrencyCode, number>>
>;

export type ApiConfig = {
  cache: number;
  fetchOptions: RequestInit;
  disabled: boolean;
  url: {
    base: string;
    builder: (url: string, code?: CurrencyCode) => string;
  };
  setter: (response: any, mutable: Ref<ApiData>) => void;
};

export interface RequiredModel {
  currencies: [CurrencyCode, CurrencyCode];
  values: [string, string];
  hasFocus: [boolean, boolean];
  loading: boolean;
}

export type Model = Partial<RequiredModel>;

export type InternalApiData = Ref<ApiData>;

export interface DefaultApiResponse {
  base_code: CurrencyCode;
  rates: Record<CurrencyCode, number>;
}

export type Size = "sm" | "md" | "lg" | "xl" | "xxl";
