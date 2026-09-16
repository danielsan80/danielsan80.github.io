import type { Lang } from "../../content/localized";
import { periodLabel } from "../../content/time/labels";
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
      {(left === right ? [left] : [left, right]).map((end) => (
        <div key={end} className={styles.dot} style={{ left: percent(end) }} />
      ))}
    </div>
  );
}
