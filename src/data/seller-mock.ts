export type MockSeller = {
  name: string;
  category: string;
  gmv: number;
  gmvTrend: number;
  orders: number;
  returnRate: number;
  returnRateTrend: number;
  netMargin: number;
  categoryReturnRateMedian: number;
  categoryReturnRatePercentile: number;
  gmvPercentile: number;
};

export type MockProduct = {
  name: string;
  orders: number;
  revenue: number;
  returns: number;
  returnRate: number;
};

export type AdvancedPanelId = "return-rate-sku" | "trend-90d" | "category-position";

export type AdvancedPanel = {
  id: AdvancedPanelId;
  title: string;
  overlayHeadline: string;
  overlayBody: string;
  description: string;
};

export const mockSeller: MockSeller = {
  name: "Anna K.",
  category: "Sukienki",
  gmv: 5374,
  gmvTrend: -8.2,
  orders: 27,
  returnRate: 20.4,
  returnRateTrend: 1.6,
  netMargin: 876,
  categoryReturnRateMedian: 21,
  categoryReturnRatePercentile: 40,
  gmvPercentile: 48,
};

export const mockProducts: MockProduct[] = [
  { name: 'Sukienka Mini "Wave"', orders: 8, revenue: 1520, returns: 3, returnRate: 38 },
  { name: 'Sukienka Midi "Linen"', orders: 6, revenue: 1140, returns: 1, returnRate: 17 },
  { name: 'Sukienka Maxi "Sunset"', orders: 5, revenue: 980, returns: 1, returnRate: 20 },
  { name: 'Bluzka "Soft Knit"', orders: 3, revenue: 540, returns: 0, returnRate: 0 },
  { name: 'Spódnica "Pleated"', orders: 2, revenue: 480, returns: 1, returnRate: 50 },
  { name: 'Sukienka Mini "Cotton"', orders: 2, revenue: 380, returns: 0, returnRate: 0 },
  { name: 'Top "Silk"', orders: 1, revenue: 334, returns: 0, returnRate: 0 },
];

export const advancedPanels: AdvancedPanel[] = [
  {
    id: "return-rate-sku",
    title: "Dowiedz się, który produkt generuje zwroty",
    overlayHeadline: "Jeden produkt odpowiada za 42% Twoich zwrotów",
    overlayBody:
      "Zobacz dokładnie który produkt obniża Twój zysk, ile Cię kosztuje miesięcznie i jak go naprawić — z konkretną rekomendacją popartą danymi z Twojej kategorii.",
    description: "Który produkt wycofać i ile zaoszczędzisz miesięcznie",
  },
  {
    id: "trend-90d",
    title: "Twój przychód spada 3 miesiące z rzędu",
    overlayHeadline: "Trend 90 dni: -18% wobec poprzedniego kwartału",
    overlayBody:
      "Pokażemy Ci wykres przychodu z ostatnich 90 dni, zidentyfikujemy moment załamania i wskażemy 2 najbardziej prawdopodobne przyczyny w Twoim asortymencie.",
    description: "Gdzie Twój przychód zaczął spadać i co to powoduje",
  },
  {
    id: "category-position",
    title: "Sprawdź gdzie Twoja stopa zwrotów wypada na tle sprzedawców w Twojej kategorii",
    overlayHeadline: "Top 25% sprzedawców ma zwroty 12% — Ty masz 20,4%",
    overlayBody:
      "Porównaj swoją stopę zwrotów, sprzedaż i zysk z medianą i najlepszymi 25% sprzedawców w kategorii Sukienki. Zobacz, co robią inaczej najlepsi.",
    description: "Jak wypadasz na tle najlepszych sprzedawców sukienek",
  },
];

export function formatPln(value: number): string {
  return `${Math.round(value).toLocaleString("pl-PL").replace(/,/g, " ").replace(/\u00a0/g, " ")} PLN`;
}