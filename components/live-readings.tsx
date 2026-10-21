import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { getTrendingModels } from "@/lib/live/huggingface";
import type { LiveModel } from "@/lib/live/parse";
import { htmlLang, type Locale } from "@/lib/i18n";
import { CountUp } from "./count-up";

// §2 Live readings. Two pieces stream in their own Suspense boundaries:
// the read time (beside the title) and the table. Both await the same
// request-scoped fetch. Each fallback has the height of what replaces it.

type LiveProps = { lang: Locale; dict: Dictionary };

const SKELETON_ROWS = 5;

const readLine = "flex items-center gap-2 font-mono text-label text-muted uppercase";

export async function LiveReadTime({ dict }: { dict: Dictionary }) {
  const result = await getTrendingModels();
  // On error the line stays empty but keeps its height.
  if (!result.ok) return <p aria-hidden="true" className={readLine}>&nbsp;</p>;
  return (
    <p className={readLine}>
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-accent" />
      {dict.live.read.replace("{time}", result.readAt)}
    </p>
  );
}

export function LiveReadTimeSkeleton() {
  return (
    <p aria-hidden="true" className={readLine}>
      <span className="size-2 shrink-0 rounded-full bg-rule" />
      {/* Text inside the bar gives it the line's height and baseline. */}
      <span className="w-36 bg-rule">&nbsp;</span>
    </p>
  );
}

export async function LiveTable({ lang, dict }: LiveProps) {
  const result = await getTrendingModels();

  if (!result.ok) {
    return (
      <Notice>
        <p className="text-error">
          {dict.live.error}{" "}
          {/* A full reload of this page in this language, back at this section.
              A bare "#live" link would only scroll. */}
          <a
            href={`/${lang}?retry=1#live`}
            className="underline underline-offset-4 transition-colors duration-fast ease-standard hover:text-fg"
          >
            {dict.live.retry}
          </a>
        </p>
      </Notice>
    );
  }

  if (result.items.length === 0) {
    return (
      <Notice>
        <p className="text-muted">{dict.live.empty}</p>
      </Notice>
    );
  }

  return <Readings lang={lang} dict={dict} items={result.items} />;
}

export function LiveSkeleton({ dict }: { dict: Dictionary }) {
  return <Readings dict={dict} items={null} />;
}

function Notice({ children }: { children: ReactNode }) {
  return <div className="border-t-2 border-fg py-4 font-mono text-data">{children}</div>;
}

const bar = "inline-block h-3 bg-rule align-middle";
const cell = "border-b border-rule py-3 pr-6 align-top last:pr-0";

// The real table and its skeleton share this markup, so their rows have
// the same height by construction. `items: null` draws the skeleton.
function Readings({ lang, dict, items }: { lang?: Locale; dict: Dictionary; items: LiveModel[] | null }) {
  const cols = dict.live.cols;
  const locale = htmlLang[lang ?? "en"];
  const rows = items ?? Array.from({ length: SKELETON_ROWS }, () => null);
  const rank = (i: number) => String(i + 1).padStart(2, "0");
  const number = (value: number) => <CountUp value={value} locale={locale} />;

  return (
    <div aria-busy={items === null || undefined} className="border-t-2 border-fg font-mono tabular-nums">
      {/* md+: a real table */}
      <table className="hidden w-full table-fixed border-collapse text-left text-data md:table">
        <colgroup>
          <col className="w-16" />
          <col className="w-2/5" />
          <col />
          <col className="w-40" />
          <col className="w-40" />
        </colgroup>
        <thead className="text-label text-muted uppercase">
          <tr>
            <th scope="col" className={`${cell} font-normal`}>
              {cols.rank}
            </th>
            <th scope="col" className={`${cell} font-normal`}>
              {cols.model}
            </th>
            <th scope="col" className={`${cell} font-normal`}>
              {cols.task}
            </th>
            <th scope="col" className={`${cell} text-right font-normal`}>
              {cols.likes}
            </th>
            <th scope="col" className={`${cell} text-right font-normal`}>
              {cols.downloads}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((model, i) =>
            model ? (
              <tr key={model.id}>
                <td className={`${cell} text-muted`}>{rank(i)}</td>
                {/* One line, so the row height matches the skeleton (no CLS). */}
                <td className={`${cell} truncate`} title={model.id}>
                  {model.id}
                </td>
                <td className={`${cell} text-muted`}>{model.task ?? dict.live.noTask}</td>
                <td className={`${cell} text-right`}>{number(model.likes)}</td>
                <td className={`${cell} text-right`}>{number(model.downloads)}</td>
              </tr>
            ) : (
              <tr key={i} aria-hidden="true">
                <td className={cell}>
                  <span className={`${bar} w-5`} />
                </td>
                <td className={cell}>
                  <span className={`${bar} w-3/4`} />
                </td>
                <td className={cell}>
                  <span className={`${bar} w-1/2`} />
                </td>
                <td className={`${cell} text-right`}>
                  <span className={`${bar} w-12`} />
                </td>
                <td className={`${cell} text-right`}>
                  <span className={`${bar} w-16`} />
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      {/* Mobile: two lines per item, downloads left out (as in the preview) */}
      <ol className="md:hidden">
        {rows.map((model, i) => (
          <li
            key={model?.id ?? i}
            aria-hidden={model ? undefined : true}
            className="flex gap-2 border-b border-rule py-3"
          >
            <span className="w-8 shrink-0 text-label text-muted">{model ? rank(i) : <span className={`${bar} w-4`} />}</span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-data" title={model?.id}>
                {model ? model.id : <span className={`${bar} w-48`} />}
              </span>
              <span className="text-label text-muted">
                {model ? (
                  <>
                    {model.task ?? dict.live.noTask} · <span aria-hidden="true">♥</span>
                    <span className="sr-only">{cols.likes}</span> {number(model.likes)}
                  </>
                ) : (
                  <span className={`${bar} w-32`} />
                )}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
