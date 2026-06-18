# Feature: Seller Analytics — Fake Door Test

OPPORTUNITY: "Sprzedawcy nie mają wiarygodnych danych o tym, co napędza ich sprzedaż
i nie potrafią samodzielnie zidentyfikować przyczyn słabych wyników".
OUTCOME: "Osiągnij 1,2 mln PLN/mies przychodu pozaprowizyjnego do 31 marca 2027, mierzone jako suma przychodów ze wszystkich strumieni innych niż prowizja transakcyjna"


## Co budujemy

Dashboard sellera na /seller/dashboard z hardcoded danymi (Basic: GMV, zamówienia, stopa zwrotów,
zysk netto, top 3 produkty) i 3 zablokowanymi panelami Advanced (blur + overlay + CTA).
Seller klika "Odblokuj Analytics Advanced — 49 PLN/mies." i ląduje na /seller/unlock — to
mierzona metryka. To prototyp badawczy — bez backendu, bez płatności.

## User flow

1. Anna K. (standard seller) otwiera link z e-maila "Twój dashboard Analytics jest gotowy"
2. Widzi Basic dashboard: GMV 5 374 PLN, 27 zamówień, stopa zwrotów 20,4%, zysk netto 876 PLN
3. Przewija do zablokowanego panelu Advanced (np. "Dowiedz się, który produkt generuje zwroty")
4. Klika CTA "Odblokuj Analytics Advanced — 49 PLN/mies."
5. Ląduje na /seller/unlock?panel=return-rate-sku — metryka zapisana w logach URL

## Kryteria akceptacji

- [ ] /seller/dashboard renderuje 4 MetricCard (GMV, zamówienia, stopa zwrotów, zysk netto) z hardcoded danymi
- [ ] MetricCard "Zysk netto" (876 PLN) ma wizualne ostrzeżenie (amber/red) — wartość 16,3% GMV
- [ ] Tabela produktów: wiersze 1-3 czytelne, 4-7 rozmyte (blur 6px) z CTA overlay
- [ ] Panel "Dowiedz się, który produkt generuje zwroty" ma blur 8px + overlay z tekstem z modelu danych
- [ ] Panel "Twój przychód spada 3 miesiące z rzędu" ma blur 8px + overlay z tekstem z modelu danych
- [ ] Panel "Sprawdź gdzie Twój return rate wypada na tle sprzedawców w Twojej kategorii" ma blur 8px + overlay z tekstem z modelu danych
- [ ] Każde kliknięcie CTA ładuje /seller/unlock?panel={id} jako pełne przeładowanie strony
- [ ] Strona działa bez logowania (brak auth middleware)

## Czego NIE budujemy

- Płatności ani integracji z bramkami płatności
- Autentykacji — dane identyczne dla każdego odwiedzającego
- Mechanizmu ładowania danych z API (wszystko hardcoded, w tym rekomendacje)
- Wersji mobilnej w v0 (test skierowany do sprzedawców PC-first)
- Real-time danych (snapshot fake data wystarczy do testowania intent)
- Backend do kalkulacji rekomendacji (liczby wymyślone, ale wiarygodne)

## Przykłady

**Scenario 1: Anna K. klika "Sprawdź gdzie Twój return rate wypada na tle sprzedawców w Twojej kategorii"**

Input: Anna K. otwiera /seller/dashboard i klika CTA z panelu benchmarkingu.
Oczekiwany rezultat: Przeglądarka ładuje /seller/unlock?panel=category-position.
Widzi:
- Twój return rate: 20,4%
- Średnia kategorii (Sukienki): 21%
- Percentyl: "Jesteś w dobrych 40% (średnia)"
- Bar chart: pozycja Anny vs średnia
- Rekomendacja: "Ulepsz opis rozmiarów"
- Footer: "Zainteresowany? Analytics Advanced — 49 PLN/mies"
- Logowanie: URL odwiedzenia zapisany

**Scenario 2: Anna K. wraca na dashboard i klika "Dowiedz się, który produkt generuje zwroty"**

Input: Anna K. klika drugi CTA (return-rate-sku).
Oczekiwany rezultat: /seller/unlock?panel=return-rate-sku.
Widzi:
- Produkt: Sukienka Mini "Wave" (SKU: DRESS-2341)
- Sprzedaż: 47 szt/mies, return rate: 38%, strata: 320 PLN/mies
- Benchmark: średnia 21%, top 25%: 12%
- Rekomendacja: "Wycofaj produkt LUB zmień opis rozmiarów"
- Potencjalny wzrost: +280 PLN/mies (jeśli return rate spadnie do 21%)
- Oba kliknięcia zapisane (URL session), ale metryka sukcesu liczy unikalne sellery, nie sumę kliknięć
