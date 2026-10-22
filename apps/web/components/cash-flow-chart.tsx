"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@ledgerly/ui";
import type { CashFlowMonth } from "@/lib/data";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

/* Mark specs from the data-viz guidelines: columns <= 24px wide with a 4px rounded
 * data-end, a 2px surface gap between neighbours, hairline solid gridlines. */
const PLOT_HEIGHT = 220;
const MARGIN = { top: 8, right: 4, bottom: 28, left: 52 };
const BAR_MAX = 24;
const BAR_GAP = 2;
const RADIUS = 4;

// Fixed categorical order: series keep their color regardless of filtering.
const series = [
  { key: "moneyIn", label: "Money in", fill: "fill-chart-1", swatch: "bg-chart-1" },
  { key: "moneyOut", label: "Money out", fill: "fill-chart-2", swatch: "bg-chart-2" },
] as const;

function niceStep(max: number, count = 4) {
  const raw = max / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const n = raw / power;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * power;
}

/** Column with a rounded top and a square baseline. */
function columnPath(x: number, y: number, width: number, height: number) {
  const r = Math.min(RADIUS, height, width / 2);
  const base = y + height;
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${base}Z`;
}

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function ColumnChart({ data }: { data: CashFlowMonth[] }) {
  const [containerRef, width] = useWidth<HTMLDivElement>(640);
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const bandRefs = useRef<Array<SVGRectElement | null>>([]);

  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const max = Math.max(...data.flatMap((d) => [d.moneyIn, d.moneyOut]));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const y = (value: number) => MARGIN.top + PLOT_HEIGHT - (value / top) * PLOT_HEIGHT;
  const baseline = y(0);

  const band = plotWidth / data.length;
  const barWidth = Math.max(4, Math.min(BAR_MAX, (band * 0.56 - BAR_GAP) / 2));
  const groupWidth = barWidth * 2 + BAR_GAP;
  const bandX = (i: number) => MARGIN.left + i * band;

  const activeMonth = active === null ? null : data[active];
  const tooltipX =
    active === null ? 0 : Math.min(Math.max(bandX(active) + band / 2, 96), width - 96);

  return (
    <div ref={containerRef} className="relative min-w-0">
      <svg
        width={width}
        height={PLOT_HEIGHT + MARGIN.top + MARGIN.bottom}
        role="group"
        aria-label="Monthly money in and money out, May to October"
        className="block"
        onPointerLeave={() => setActive(null)}
      >
        {/* Hover/focus highlight sits behind the marks. */}
        {active !== null && (
          <rect
            x={bandX(active) + 2}
            y={MARGIN.top}
            width={band - 4}
            height={PLOT_HEIGHT}
            rx={6}
            className={cn("fill-muted", focused && "stroke-ring")}
            strokeWidth={focused ? 2 : 0}
          />
        )}

        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={y(tick)}
              y2={y(tick)}
              className={tick === 0 ? "stroke-border-strong" : "stroke-border"}
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
            <text
              x={MARGIN.left - 10}
              y={y(tick)}
              dy="0.32em"
              textAnchor="end"
              className="fill-foreground-muted text-xs tabular"
            >
              {formatCompactCurrency(tick)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const groupX = bandX(i) + (band - groupWidth) / 2;
          return (
            <g key={d.month}>
              {series.map((s, j) => {
                const value = d[s.key];
                return (
                  <path
                    key={s.key}
                    d={columnPath(
                      groupX + j * (barWidth + BAR_GAP),
                      y(value),
                      barWidth,
                      baseline - y(value),
                    )}
                    className={s.fill}
                  />
                );
              })}
              <text
                x={bandX(i) + band / 2}
                y={baseline + 18}
                textAnchor="middle"
                className={cn(
                  "text-xs",
                  active === i ? "fill-foreground font-medium" : "fill-foreground-muted",
                )}
              >
                {d.month}
              </text>
              {/* Hit target: the whole month band, larger than the marks. */}
              <rect
                ref={(el) => {
                  bandRefs.current[i] = el;
                }}
                x={bandX(i)}
                y={MARGIN.top}
                width={band}
                height={PLOT_HEIGHT}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${d.month}: money in ${formatCurrency(d.moneyIn)}, money out ${formatCurrency(d.moneyOut)}`}
                className="outline-none"
                onPointerEnter={() => {
                  setFocused(false);
                  setActive(i);
                }}
                onFocus={() => {
                  setFocused(true);
                  setActive(i);
                }}
                onBlur={() => {
                  setFocused(false);
                  setActive(null);
                }}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight" ? i + 1 : event.key === "ArrowLeft" ? i - 1 : null;
                  if (next === null) return;
                  event.preventDefault();
                  bandRefs.current[next]?.focus();
                }}
              />
            </g>
          );
        })}
      </svg>

      {activeMonth && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 z-(--ld-z-tooltip) grid w-44 -translate-x-1/2 animate-fade-in gap-2 rounded-lg border bg-surface-raised p-3 text-xs shadow-lg"
          style={{ left: tooltipX }}
        >
          <div className="font-medium text-foreground-muted">{activeMonth.month} 2026</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className={cn("h-0.5 w-3 rounded-full", s.swatch)} />
              <span className="font-semibold text-foreground tabular">
                {formatCurrency(activeMonth[s.key])}
              </span>
              <span className="ml-auto text-foreground-muted">{s.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 border-t pt-2">
            <span className="w-3" />
            <span className="font-semibold text-positive tabular">
              {formatCurrency(activeMonth.moneyIn - activeMonth.moneyOut, { signed: true })}
            </span>
            <span className="ml-auto text-foreground-muted">Net</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CashFlowTable({ data }: { data: CashFlowMonth[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Month</TableHead>
          <TableHead className="text-right">Money in</TableHead>
          <TableHead className="text-right">Money out</TableHead>
          <TableHead className="text-right">Net</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d) => (
          <TableRow key={d.month}>
            <TableCell className="font-medium">{d.month} 2026</TableCell>
            <TableCell className="text-right tabular">{formatCurrency(d.moneyIn)}</TableCell>
            <TableCell className="text-right tabular">{formatCurrency(d.moneyOut)}</TableCell>
            <TableCell className="text-right font-medium text-positive tabular">
              {formatCurrency(d.moneyIn - d.moneyOut, { signed: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CashFlowCard({ data }: { data: CashFlowMonth[] }) {
  const latest = data.at(-1);

  return (
    <Card>
      <Tabs defaultValue="chart" className="gap-6">
        <CardHeader>
          <CardTitle>Cash flow</CardTitle>
          <CardDescription>Money in vs. money out, last 6 months</CardDescription>
          <CardAction>
            <TabsList className="h-8">
              <TabsTrigger value="chart" className="px-2.5 text-xs">
                Chart
              </TabsTrigger>
              <TabsTrigger value="table" className="px-2.5 text-xs">
                Table
              </TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TabsContent value="chart" className="grid min-w-0 grid-cols-1 gap-4">
            {/* Legend: always present for 2+ series; carries the latest values too. */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {series.map((s) => (
                <li key={s.key} className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-xs", s.swatch)} aria-hidden="true" />
                  <span className="text-foreground-muted">{s.label}</span>
                  {latest && (
                    <span className="font-medium">
                      {formatCompactCurrency(latest[s.key])}{" "}
                      <span className="font-normal text-foreground-muted">in {latest.month}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <ColumnChart data={data} />
          </TabsContent>
          <TabsContent value="table">
            <CashFlowTable data={data} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
