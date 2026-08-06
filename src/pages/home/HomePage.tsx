import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.name}>Danilo Sanchi</h1>
        <p className={styles.tagline}>
          Software engineer. I have been building things with care since 2007,
          at the office and in the garage.
        </p>
        <p className={styles.status}>
          Currently freelance, open to new collaborations.
        </p>
        <p className={styles.handle}>
          Also{" "}
          <a href="https://github.com/danielsan80">
            <span className={styles.mono}>danielsan80</span>
          </a>{" "}
          on GitHub and Packagist.
        </p>
      </header>
    </main>
  );
}
