PROJECT: Seller Analytics Dashboard — Fake Door
ROLE: Budujesz statyczną stronę fake-door na FashionHero mierzącą, czy standard sellerzy chcą zapłacić za Analytics Advanced (49 PLN/mies.).

## Cel aplikacji

Statyczna trasa /seller/dashboard w Next.js 16 pokazuje sellerowi działający Basic dashboard
(hardcoded dane: GMV, zamówienia, stopa zwrotów, zysk netto, top 3 produkty) oraz 3 zablokowane panele
Advanced z blur + overlay + CTA. Kliknięcie "Odblokuj Analytics Advanced — 49 PLN/mies."
kieruje na /seller/unlock?panel={panelId} — to mierzona metryka testu desirability.
Brak backendu, brak autentykacji — to prototyp badawczy, nie produkcja.

## Wytyczne designu

- Panel sellera bez headera sklepu. Osobny layout (src/app/seller/layout.tsx).
- Panele zablokowane: blur(8px) + ciemny overlay + ikona Lock (lucide-react) + opis wartości + CTA button.
- Widoczne metryki Basic: 4 shadcn/ui Card w rzędzie (GMV, Zamówienia, Stopa zwrotów, Zysk netto),
  tabela produktów z wierszami 1-3 czytelnymi. Zysk netto wyróżniony kolorem (wartość niska = ostrzeżenie).
- Reużywaj istniejące komponenty (layout, kolorystyka, fonty) — nie buduj custom UI.  
- Używaj wykresów tylko dla trendów czasowych

## Styl kodu

Stack: Next.js 16 App Router, React 19, TypeScript strict, shadcn/ui, Tailwind CSS v4.
- Named exports, PascalCase: `export function LockedOverlay()` / nie `export default function()`
- `"use client"` tylko przy interakcjach — reszta Server Components
- Klasy Tailwind przez `cn()` z @/lib/utils, zero inline styles
- Dane mockowe w `src/data/seller-mock.ts`, nie w JSX

## Reguły domenowe

Kwoty w PLN, format: `5 374 PLN` (spacja jako separator tysięcy, bez groszy).
CTA to zwykły `<a href="/seller/unlock?panel={panelId}">` — nie router.push (potrzebne pełne przeładowanie dla loggowania w URL).

## Model danych

`MockSeller`: name, category, gmv, gmvTrend, orders, returnRate, returnRateTrend,
              netMargin, categoryReturnRateMedian, categoryReturnRatePercentile, gmvPercentile
`MockProduct[]`: name, orders, revenue, returns, returnRate
`AdvancedPanel`: id ("return-rate-sku" | "trend-90d" | "category-position"),
                 title, overlayHeadline, overlayBody, description

## Example output

MetricCard "Zysk netto" — oczekiwany kształt:
  Label: "Zysk netto" | Value: "876 PLN" | Trend: brak
  Kolor wartości: amber (netMargin/gmv < 20%, tj. 876/5 374 = 16,3%)

## Granice

ALWAYS:
- Dane MockSeller i teksty overlayów: użyj WYŁĄCZNIE wartości z seller-mock.ts.
  Plik zawiera 11 pól MockSeller (w tym netMargin: 876), MockProduct[7] i 3 AdvancedPanel
  z overlayHeadline + overlayBody. Nie generuj własnych wartości ani nie parafrazuj overlayów.
- CTA prowadzi na `/seller/unlock?panel={panelId}` jako zwykły <a>, nie Link z routera
- Tabela produktów: wiersze 1-3 widoczne, 4-7 z blur(6px) i overlay; panele 3/4/5 blur(8px)
- MetricCard "Zysk netto": label "Zysk netto", value "876 PLN", kolor amber
  (netMargin/gmv = 16,3% < 20% → amber) — nie ukrywaj ani nie zmieniaj wartości

ASK FIRST:
- Zanim zmienisz cenę lub tekst CTA (zmiana wpływa na mierzony intent)
- Zanim dodasz nową metrykę do MockSeller lub zmienisz layout dashboardu

NEVER:
- Nie implementuj autentykacji ani połączeń z API/bazą danych
- Nie dodawaj formularzy płatności — /seller/unlock to strona "Dziękujemy za zainteresowanie — powiadomimy Cię o starcie." bez checkout
- Nie zastępuj hardcoded danych placeholderami ani losowymi liczbami
