import Link from "next/link";
import type { Metadata } from "next";
import { Lock, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  advancedPanels,
  formatPln,
  mockProducts,
  mockSeller,
  type AdvancedPanel,
} from "@/data/seller-mock";

export const metadata: Metadata = {
  title: "Twoj dashboard Analytics — FashionHero",
  description: "Podglad sprzedazy, zwrotow i zysku Twojego sklepu.",
  robots: "noindex",
};

const CTA_LABEL = "Odblokuj Analytics Advanced — 49 PLN/mies.";

export default function SellerDashboardPage() {
  const netMarginRatio = mockSeller.netMargin / mockSeller.gmv;
  const netMarginAmber = netMarginRatio < 0.2;

  return (
    <main className="min-h-screen bg-[#f1ece4] text-stone-900">
      <SellerTopbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-stone-500">Twój sklep</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Cześć, {mockSeller.name}</h1>
          <p className="mt-1 text-sm text-stone-600">
            Snapshot z ostatnich 30 dni · kategoria {mockSeller.category}
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="GMV"
            value={formatPln(mockSeller.gmv)}
            trend={mockSeller.gmvTrend}
          />
          <MetricCard
            label="Zamówienia"
            value={mockSeller.orders.toString()}
            trend={null}
          />
          <MetricCard
            label="Stopa zwrotów"
            value={`${mockSeller.returnRate.toString().replace(".", ",")}%`}
            trend={mockSeller.returnRateTrend}
            trendInverted
          />
          <MetricCard
            label="Zysk netto"
            value={formatPln(mockSeller.netMargin)}
            trend={null}
            tone={netMarginAmber ? "amber" : "neutral"}
            hint={`${Math.round(netMarginRatio * 1000) / 10}% GMV`.replace(".", ",")}
          />
        </section>

        <section className="mt-10">
          <SectionHeader
            eyebrow="Top produkty"
            title="Twoje produkty (top 7)"
            sub="Wiersze 4–7 dostępne w Analytics Advanced"
          />
          <ProductsTable />
        </section>

        <section className="mt-12 space-y-6">
          <SectionHeader
            eyebrow="Analytics Advanced"
            title="Trzy obszary, które wpływają na Twój zysk — i których teraz nie widzisz"
            sub={undefined}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {advancedPanels.map((panel) => (
              <LockedPanel key={panel.id} panel={panel} />
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-stone-300 pt-6 text-xs text-stone-500">
          FashionHero · Panel sprzedawcy · Dane przykładowe na potrzeby podglądu
        </footer>
      </div>
    </main>
  );
}

function SellerTopbar() {
  return (
    <div className="border-b border-stone-300 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/seller/dashboard" className="font-serif text-xl italic tracking-tight">
          FashionHero<span className="text-stone-400"> · Seller</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-stone-600">
          <span className="hidden sm:inline">{mockSeller.name}</span>
          <div className="size-8 rounded-full bg-stone-200" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs uppercase tracking-widest text-stone-500">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      {sub ? <p className="mt-1 text-sm text-stone-600">{sub}</p> : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  trendInverted = false,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  trend: number | null;
  trendInverted?: boolean;
  tone?: "neutral" | "amber";
  hint?: string;
}) {
  const valueTone = tone === "amber" ? "text-amber-600" : "text-stone-900";
  return (
    <div className="rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-stone-500">{label}</p>
      <p className={cn("mt-3 text-3xl font-semibold tracking-tight tabular-nums", valueTone)}>
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
        {trend !== null ? <TrendBadge value={trend} inverted={trendInverted} /> : null}
        {hint ? <span>{hint}</span> : null}
        {trend === null && !hint ? <span>&nbsp;</span> : null}
      </div>
    </div>
  );
}

function TrendBadge({ value, inverted }: { value: number; inverted: boolean }) {
  const positive = value > 0;
  const good = inverted ? !positive : positive;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
        good ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
      )}
    >
      <Icon className="size-3" />
      {positive ? "+" : ""}
      {value.toString().replace(".", ",")}%
    </span>
  );
}

function ProductsTable() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-stone-300 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-left text-xs uppercase tracking-widest text-stone-500">
          <tr>
            <th className="px-5 py-3 font-medium">Produkt</th>
            <th className="px-5 py-3 font-medium">Zamówienia</th>
            <th className="px-5 py-3 font-medium">Przychód</th>
            <th className="px-5 py-3 font-medium">Zwroty</th>
            <th className="px-5 py-3 font-medium">Return rate</th>
          </tr>
        </thead>
        <tbody>
          {mockProducts.map((p, idx) => {
            const locked = idx >= 3;
            return (
              <tr
                key={p.name}
                className={cn(
                  "border-t border-stone-200 tabular-nums",
                  locked && "select-none [filter:blur(6px)]",
                )}
                aria-hidden={locked || undefined}
              >
                <td className="px-5 py-3 font-medium text-stone-900">{p.name}</td>
                <td className="px-5 py-3 text-stone-700">{p.orders}</td>
                <td className="px-5 py-3 text-stone-700">{formatPln(p.revenue)}</td>
                <td className="px-5 py-3 text-stone-700">{p.returns}</td>
                <td className="px-5 py-3 text-stone-700">
                  {p.returnRate.toString().replace(".", ",")}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white via-white/85 to-white/0" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-6 pt-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-stone-900/5 px-3 py-1 text-xs font-medium text-stone-700">
          <Lock className="size-3.5" />
          4 kolejne produkty ukryte
        </div>
        <Link
          href="/seller/unlock?panel=return-rate-sku&source=table"
          className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-800"
        >
          {CTA_LABEL}
        </Link>
      </div>
    </div>
  );
}

function LockedPanel({ panel }: { panel: AdvancedPanel }) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-stone-300 bg-white shadow-sm">
      <div className="select-none p-6 [filter:blur(8px)]" aria-hidden>
        <p className="text-xs uppercase tracking-widest text-stone-500">Advanced</p>
        <h3 className="mt-2 text-lg font-semibold text-stone-900">{panel.title}</h3>
        <div className="mt-5 h-32 rounded-md bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 rounded bg-stone-200" />
          <div className="h-3 w-2/3 rounded bg-stone-200" />
          <div className="h-3 w-1/2 rounded bg-stone-200" />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col bg-stone-900/55 p-6 text-white backdrop-blur-[2px]">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest">
          <Lock className="size-3" />
          Analytics Advanced
        </div>
        <h3 className="mt-4 text-xl font-semibold leading-snug">{panel.overlayHeadline}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{panel.overlayBody}</p>
        <p className="mt-3 text-xs text-white/60">{panel.description}</p>
        <div className="mt-auto pt-6">
          <Link
            href={`/seller/unlock?panel=${panel.id}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-sm transition-colors hover:bg-stone-100"
          >
            {CTA_LABEL}
          </Link>
        </div>
      </div>
    </article>
  );
}