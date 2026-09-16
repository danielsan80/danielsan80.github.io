import type { Lang } from "../localized";
import { dateParts, type PartialDate, type Period } from "./period";

const MONTHS: Record<Lang, string[]> = {
  it: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const STILL_GOING: Record<Lang, string> = { it: "oggi", en: "present" };
const SINCE: Record<Lang, string> = { it: "Dal", en: "Since" };

export function dateLabel(date: PartialDate, lang: Lang): string {
  const { year, month, day } = dateParts(date);

  if (month === undefined) {
    return String(year);
  }

  const label = `${MONTHS[lang][month - 1]} ${year}`;
  return day === undefined ? label : `${day} ${label}`;
}

export function periodLabel(period: Period, lang: Lang): string {
  const { start, end } = period;

  if (end === undefined) {
    return dateParts(start).month === undefined
      ? `${SINCE[lang]} ${start}`
      : `${dateLabel(start, lang)} - ${STILL_GOING[lang]}`;
  }

  if (start === end) {
    return dateLabel(start, lang);
  }

  const from = dateParts(start);
  const to = dateParts(end);

  if (
    from.month !== undefined &&
    from.day !== undefined &&
    to.day !== undefined &&
    from.year === to.year &&
    from.month === to.month
  ) {
    return `${from.day}-${to.day} ${MONTHS[lang][from.month - 1]} ${from.year}`;
  }

  return `${dateLabel(start, lang)} - ${dateLabel(end, lang)}`;
}
