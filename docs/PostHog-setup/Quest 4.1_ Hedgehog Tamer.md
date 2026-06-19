
# **Quest 4.1: Hedgehog Tamer**

Twój prototyp wciąż siedzi w Lovable albo innym AI Builderze. Czas go wypchnąć na świat \- i podpiąć analitykę. Bez analityki nie wiesz, co ludzie z nim robią. Patrzysz w mgłę.

Cel: live URL \+ PostHog widzący kliknięcia i pageviews.

---

## **Co masz**

* Twój prototyp z questa 3.2 (w Lovable)  
* Konto PostHog (jeśli nie masz \- załóż teraz: posthog.com, plan free, 5 minut)

---

## **Co robisz**

Wybierz JEDNĄ ze ścieżek \- A albo B. Cel jest ten sam: live URL \+ PostHog widzący ruch.

### **Ścieżka A: Lovable Publish \+ PostHog snippet (\~15 min, polecana dla większości)**

**1\. Publish prototypu w Lovable**

* W Lovable: prawy górny róg → **"Publish"**  
* Dostajesz URL `[twój-projekt].lovable.app`  
* Otwórz w incognito \- sprawdź że działa

**2\. Skopiuj project token z PostHog**

W PostHog: **Settings → Project \- skopiuj project tken**

**![][image1]**

**3\. Wklej snippet do Lovable**

Prompt do agenta Lovable:

*Dodaj integrację z posthog \- serwer EU, project token: TU\_WKLEJ\_SWOJ\_PROJECT\_TOKEN*

Czekaj aż agent skończy. **Republish**.

**4\. Zweryfikuj że PostHog widzi ruch**

* Otwórz live URL w incognito  
* Klikaj parę rzeczy, **klikaj linki/przyciski nawigacyjne** (route changes)  
* Wróć do PostHog → **Activity → Events**  
* Powinieneś zobaczyć:  
  * `$pageview` przy każdym wejściu na stronę I route change (dzięki `defaults:'2026-01-30'`)  
  * `$autocapture` przy każdym kliknięciu i submicie formularza  
* Jeśli nie widać po 2 minutach: F12 w przeglądarce → Console → szukaj "posthog" lub "CORS"

---

### **Ścieżka B: Claude Code \+ Vercel \+ PostHog Wizard CLI (\~30 min, dla zaawansowanych)**

Wybierz tę ścieżkę TYLKO jeśli:

* Już używasz GitHuba i Vercela  
* Chcesz mieć kod w swoim repo

Jeśli masz wątpliwości \- idź ścieżką A. Naprawdę. Cel jest taki sam.

**1\. Wyciągnij kod z Lovable do GitHub**

* W Lovable: **Settings → Connect to GitHub** → tworzy repo  
* Sklonuj lokalnie: `git clone [URL repo]`

**2\. Deploy na Vercel**

* vercel.com → **Add New Project** → import z GitHub  
* Vercel sam wykryje framework i zdeployuje  
* Dostajesz URL `[twój-projekt].vercel.app`

**3\. Podepnij PostHog przez Wizard CLI**

PostHog ma oficjalny **AI Wizard** który robi całą robotę za ciebie: analizuje twój kod, instaluje paczki, ustawia `.env`, pisze init code dopasowany do frameworka (Vite, Next.js, itd.). To **oficjalnie polecana metoda PostHog**.

W terminalu, w katalogu projektu:

npx @posthog/wizard@latest

Wizard zapyta cię o:

* Login do PostHog (OAuth w przeglądarce \- kliknij link który wizard wypluje)  
* Który projekt PostHog (jeśli masz kilka)  
* Czy włączyć session replay / error tracking (zostaw defaults albo wyłącz \- basic deploy nie wymaga)

Po zakończeniu wizard:

* Zainstaluje `posthog-js` (+ `@posthog/react` jeśli React)  
* Doda klucze do `.env.local` (dla Vite: `VITE_PUBLIC_POSTHOG_KEY` \+ `VITE_PUBLIC_POSTHOG_HOST`)  
* Doda `posthog.init()` z poprawną konfiguracją w odpowiednim miejscu  
* Owinie aplikację w `<PostHogProvider>` jeśli to React

💡 **Wariant z Claude Code**: w katalogu projektu, prompt do Claude Code:  
 *"Uruchom `npx @posthog/wizard@latest` i pomoz mi przejsc przez kolejne pytania. Wybieramy najprostsza opcje \- tylko podstawowy tracking (pageviews \+ clicks), bez session replay i error tracking."*

Claude Code uruchomi wizard, podpowie odpowiedzi i sprawdzi czy pliki wyglądają OK po zakończeniu.

**4\. Dodaj env vars do Vercel**

Wizard zaktualizował `.env.local` (lokalnie). Vercel tego pliku NIE widzi (jest w `.gitignore`). Musisz dodać te same zmienne ręcznie:

* Vercel dashboard → projekt → **Settings → Environment Variables**  
* Dodaj `VITE_PUBLIC_POSTHOG_KEY` (skopiuj wartość z lokalnego `.env.local`)  
* Dodaj `VITE_PUBLIC_POSTHOG_HOST`  
* W projekcie: `git add . && git commit -m "Add PostHog" && git push` → Vercel zdeployuje wersję z PostHog (\~1 min). Jeśli env vars były ustawione PO pushu, kliknij **Redeploy** w Vercel.

**5\. Zweryfikuj że PostHog widzi ruch**  
 Tak samo jak w ścieżce A: otwórz live URL → klikaj → PostHog **Activity → Events** powinien pokazywać `$pageview` i `$autocapture`.

---

## **Krok 5 (dla obu ścieżek): Zrób Action z autocapture**

Surowy `$autocapture` to szum \- widzisz że ktoś coś kliknął, ale nie wiesz CZY KLIKNĄŁ TO co cię interesuje. **Action** to nazwana metryka zbudowana z konkretnego eventu \- most między "leje się data" a "rozumiem co robią użytkownicy."

**1\. Wybierz jeden najważniejszy element w swoim prototypie**

Coś co reprezentuje kluczowe zachowanie \- przykłady:

* Button "Sign up" / "Zacznij" / "Try it free"  
* Button do dodawania czegoś (np. "Add to cart", "Save")  
* Link do nawigacji w glowne miejsce produktu  
* Submit formularza

Jeden element. Najważniejszy.

**2\. Włącz PostHog Toolbar na swoim live URL**

* W PostHog: **Tools → Toolbar** (albo Settings → Toolbar)  
* Wklej swój live URL → kliknij **"Launch Toolbar"**  
* PostHog otworzy twoją apkę z floating toolbarem na dole

**3\. Stwórz Action z elementu**

* W toolbarze: kliknij **"Actions"** → **"+ New action"**  
* Strona zaznaczy klikalne elementy na niebiesko  
* Najedź na element który wybrałeś w kroku 1 → kliknij  
* W modalu wpisz nazwę (np. "Signup button clicked", "Add to cart clicked")  
* **Save action**

**4\. Sprawdź że Action się liczy**

* Kliknij ten sam element parę razy na live URL  
* Wróć do PostHog → **Data → Actions**  
* Twoja akcja powinna mieć licznik \> 0  
* 💡 Tę akcję będziesz mógł użyć w dashboardach, lejkach i A/B testach

---

## **Checklist**

* Live URL działa (otwórz w incognito \- widzisz prototyp)  
* PostHog podpięty do Twojego projektu  
* PostHog `$pageview` widoczny w Live Events (każde wejście \+ route change \= event)  
* PostHog `$autocapture` widoczny w Live Events (każde kliknięcie \= event)  
* **Jedna Action zdefiniowana z najważniejszego elementu prototypu** (krok 5\)

---

## **Jeśli utknąłeś**

* **PostHog nie loguje żadnych eventów (ścieżka A)**: F12 → Console → szukaj błędów. Najczęściej: snippet nie został wklejony, albo wklejony do złego pliku. Sprawdź `index.html` w live URL (View Source) \- czy widzisz tam `posthog.init`?  
* **PostHog nie loguje eventów (ścieżka B)**: sprawdź czy env vars są w **Vercel dashboard → Settings → Environment Variables**. `.env.local` lokalnie nie wystarczy. Po dodaniu env vars zrob Redeploy.  
* **Widzę `$pageview` raz przy wejściu, potem cisza mimo klikania w nawigację**: snippet jest stary (bez `defaults:'2026-01-30'`). Wymień snippet na nowszą wersję lub dodaj parametr ręcznie do `posthog.init(...)`.  
* **Wizard CLI się crashuje**: sprawdź czy masz Node 18+. Jeśli OAuth nie otwiera przeglądarki \- skopiuj URL z terminala ręcznie.  
* **Toolbar nie pokazuje się na live URL**: sprawdź czy domena jest dodana w PostHog **Settings → Project → Authorized URLs**.  
* **Action ma licznik 0 mimo klikania**: poczekaj 30s i odśwież. Sprawdź też że klikasz dokładnie ten element który wybrałeś (Action może być za bardzo specyficzna \- możesz edytować selector).  
* **Lovable Publish nie działa**: sprawdź czy projekt nie ma błędów buildu. Sprawdź czy nie przekroczyłeś limitu credits (plan free).  
* **Vercel build failuje**: sprawdź logi w Vercel dashboard. Najczęściej brak env vars albo agent wkleił coś w złym miejscu.  
* **Idź po pomoc na Discord**: jak utkniesz na 30 min \- wrzuć screen errora i pytanie. Nie męcz się sam.

---

## **Dla ciekawych \- alternatywne ścieżki**

**Lovable Pro?** Masz oficjalną integrację przez MCP server: **Settings → Connectors → Personal connectors → New MCP server** (OAuth z PostHog). Agent sam dociąga klucze i instaluje. Wymaga **paid Lovable plan**.

**Chcesz tracking server-side / Next.js App Router?** Wizard CLI to ogarnie automatycznie \- wybierz "yes" przy pytaniu o server-side tracking. Zainstaluje też Node SDK i poprawnie zintegruje z App Router.

# backup posthog

**2\. Skopiuj snippet z PostHog**

* W PostHog: **Settings → Project → Snippet** (lub onboarding wizard po założeniu konta)  
   Pasted image 20260511115712.png

![][image2]

![][image3]

* PostHog wygeneruje gotowy snippet z **twoim kluczem już wbitym w środku** \- wygląda mniej więcej tak:

`<script>`  
  `!function(t,e){var o,n,p,r;...}(document,window.posthog||[]);`  
  `posthog.init('phc_TWOJ_KLUCZ_TUTAJ',{api_host:'https://eu.i.posthog.com', defaults:'2026-01-30'})`  
`</script>`

**Ważne**: musi być `defaults:'2026-01-30'` (albo nowsza data). Ten parametr włącza autocapture \+ pageview tracking SPA out of the box. Jeśli kopiujesz starszy snippet bez `defaults` \- poproś PostHog o nowy albo dodaj ręcznie.

💡 Klucz API w snippet jest **OK do publikacji** \- to publiczny klucz client-side, taki sam zostanie i tak wysłany do przeglądarki użytkownika. To nie jest sekret.

**3\. Wklej snippet do Lovable**

Prompt do agenta Lovable:

*Wklej ponizszy snippet PostHog na koncu sekcji `<head>` w pliku `index.html` (Vite) \- tak zeby ladowal sie przed reszta aplikacji. NIE modyfikuj snippetu, wklej dokladnie tak jak jest:*

*\[WKLEJ\_TUTAJ\_CALY\_SNIPPET\]*

Czekaj aż agent skończy. **Republish**.
