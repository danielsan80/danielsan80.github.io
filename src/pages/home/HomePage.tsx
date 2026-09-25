import { Fragment, useEffect } from "react";
import { Controls } from "../../components/controls/Controls";
import { useLang } from "../../components/controls/preferences";
import { contact } from "../../content/contact";
import { identity } from "../../content/identity";
import { pick } from "../../content/localized";
import { profiles } from "../../content/profiles";
import { highlightedProjects } from "../../content/projects";
import styles from "./HomePage.module.css";

const PROJECTS = { it: "Progetti", en: "Projects" };
const MORE_PROJECTS = { it: "Tutti i progetti", en: "All projects" };
const FIND_ME = { it: "Dove trovarmi", en: "Find me" };

export function HomePage() {
  const [lang] = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={styles.page}>
      <Controls />

      <header className={styles.intro}>
        <img
          className={styles.portrait}
          src={identity.portrait.src}
          alt={pick(identity.portrait.alt, lang)}
        />
        <h1 className={styles.name}>{identity.name}</h1>
        <p className={styles.headline} lang="en">
          {identity.channels.home.headline.map((line) => (
            <span key={line.join()} className={styles.headlineLine}>
              {line.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 && <span className={styles.separator}> · </span>}
                  <span className={styles.headlineItem}>{item}</span>
                </Fragment>
              ))}
            </span>
          ))}
        </p>
        <p className={styles.summary}>
          {pick(identity.channels.home.summary, lang)}
        </p>
      </header>

      <main>
        <section className={styles.projects} aria-labelledby="projects">
          <h2 className={styles.sectionTitle} id="projects">
            {pick(PROJECTS, lang)}
          </h2>

          {highlightedProjects.map((project) => (
            <article
              key={project.name}
              className={styles.project}
              aria-label={project.name}
            >
              <img
                className={styles.photo}
                src={project.highlight.photo.src}
                alt={pick(project.highlight.photo.alt, lang)}
              />
              <div>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectSummary}>
                  {pick(project.channels.site, lang)}
                </p>
                <ul className={styles.projectLinks}>
                  {project.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <p className={styles.moreProjects}>
            <a href="/projects">{pick(MORE_PROJECTS, lang)} →</a>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <h2 className={styles.sectionTitle}>{pick(FIND_ME, lang)}</h2>

        <ul className={styles.profiles}>
          {profiles.map((profile) => (
            <li key={profile.url}>
              <a href={profile.url}>{profile.name}</a>{" "}
              <span className={styles.mono}>{profile.handle}</span>
            </li>
          ))}
          <li>
            <a href={`mailto:${contact.email}`}>Email</a>{" "}
            <span className={styles.mono}>{contact.email}</span>
          </li>
        </ul>
      </footer>
    </div>
  );
}
