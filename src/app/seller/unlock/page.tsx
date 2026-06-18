import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { advancedPanels, type AdvancedPanelId } from "@/data/seller-mock";

export const metadata: Metadata = {
  title: "Dziekujemy — Analytics Advanced FashionHero",
  description: "Powiadomimy Cie o starcie Analytics Advanced.",
  robots: "noindex",
};

export default function SellerUnlockPage({
  searchParams,
}: {
  searchParams: { panel?: string };
}) {
  const { panel } = searchParams;
  const matched = advancedPanels.find((p) => p.id === (panel as AdvancedPanelId));

  return (
    <main className="min-h-screen bg-[#f1ece4] text-stone-900">
      <div className="border-b border-stone-300 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/seller/dashboard" className="font-serif text-xl italic tracking-tight">
            FashionHero<span className="text-stone-400"> · Seller</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-stone-300 bg-white p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="size-3.5" />
            Zapisaliśmy Twoje zainteresowanie
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Dziękujemy za zainteresowanie
          </h1>
          <p className="mt-3 text-stone-600">
            Analytics Advanced jeszcze nie wystartowało. Powiadomimy Cię o starcie e-mailem
            podpiętym do Twojego konta sprzedawcy — bez żadnych dalszych kroków z Twojej strony.
          </p>

          {matched ? (
            <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-widest text-stone-500">
                Panel, którym jesteś zainteresowana
              </p>
              <p className="mt-2 text-base font-medium text-stone-900">{matched.title}</p>
              <p className="mt-1 text-sm text-stone-600">{matched.description}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100"
            >
              Wróć do dashboardu
            </Link>
            <span className="text-xs text-stone-500">
              Dostęp do wszystkich paneli Advanced — 49 PLN/mies.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}