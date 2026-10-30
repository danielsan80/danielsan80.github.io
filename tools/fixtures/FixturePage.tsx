import styles from "./FixturePage.module.css";

// Stands in for a real page in the pre-render test. The point is to exercise
// the pipeline — TSX and CSS modules loaded outside a browser — without tying
// the test to the copy of a page that will keep being rewritten.
export function FixturePage({ lang }: { lang: string }) {
  return (
    <p className={styles.box} lang={lang}>
      Rendered without a browser.
    </p>
  );
}
