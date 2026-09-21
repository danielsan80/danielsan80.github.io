import type { Lang } from "../../content/localized";
import { dateLabel, periodLabel } from "../../content/time/labels";
import type { Period } from "../../content/time/period";
import styles from "./Lane.module.css";
import { place, type Domain } from "./placement";

const percent = (value: number) => `${value.toFixed(2)}%`;

type LaneProps = {
  period: Period;
  domain: Domain;
  lang: Lang;
};

export function Lane({ period, domain, lang }: LaneProps) {
  const { left, right, width } = place(period, domain);
  // A dot marks a date. An open period has no second date — it runs to the edge
  // of the domain — so it gets no dot there.
  const ends = [{ at: left, label: dateLabel(period.start, lang) }];
  if (period.end !== undefined && left !== right) {
    ends.push({ at: right, label: dateLabel(period.end, lang) });
  }

  return (
    <div
      className={styles.lane}
      role="img"
      aria-label={periodLabel(period, lang)}
    >
      <div className={styles.axis} />
      {left !== right && (
        <div
          className={styles.range}
          style={{ left: percent(left), width: percent(width) }}
        />
      )}
      {ends.map((end) => (
        <div
          key={end.at}
          className={styles.dot}
          style={{ left: percent(end.at) }}
          data-label={end.label}
        />
      ))}
    </div>
  );
}
