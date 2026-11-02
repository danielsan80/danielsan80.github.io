import { contact } from "../../content/contact";
import { pick, type Lang } from "../../content/localized";
import { profiles } from "../../content/profiles";
import styles from "./Footer.module.css";

const FIND_ME = { it: "Dove trovarmi", en: "Find me" };

type FooterProps = {
  lang: Lang;
};

export function Footer({ lang }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>{pick(FIND_ME, lang)}</h2>

      <ul className={styles.profiles}>
        {profiles.map((profile) => (
          <li key={profile.url}>
            <a href={profile.url}>{profile.name}</a>{" "}
            <span className={styles.handle}>{profile.handle}</span>
          </li>
        ))}
        <li>
          <a href={`mailto:${contact.email}`}>Email</a>{" "}
          <span className={styles.handle}>{contact.email}</span>
        </li>
      </ul>
    </footer>
  );
}
