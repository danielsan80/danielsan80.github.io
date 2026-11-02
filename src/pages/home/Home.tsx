import { Fragment } from "react";
import { Footer } from "../../components/footer/Footer";
import { TopBar } from "../../components/top-bar/TopBar";
import { identity } from "../../content/identity";
import { pick, type Lang } from "../../content/localized";
import { highlightedProjects } from "../../content/projects";
import { pagePath } from "../../site/paths";
import styles from "./Home.module.css";

const PROJECTS = { it: "Progetti", en: "Projects" };
const MORE_PROJECTS = { it: "Tutti i progetti", en: "All projects" };

type HomeProps = {
  lang: Lang;
};

export function Home({ lang }: HomeProps) {
  return (
    <>
      <TopBar page="home" lang={lang} />
      <div className={styles.page}>
        <header className={styles.intro}>
          <img
            className={styles.portrait}
            src={identity.portrait.src}
            alt={pick(identity.portrait.alt, lang)}
          />
          <h1 className={styles.name}>{identity.name}</h1>
          <p className={styles.headline} lang="en">
            {identity.channels.home.headline.map((line) => (
              <span
                key={line.join()}
                className={styles.headlineLine}
                data-testid="headline-line"
              >
                {line.map((item, index) => (
                  <Fragment key={item}>
                    {index > 0 && <span className={styles.separator}> · </span>}
                    <span className={styles.headlineItem}>{item}</span>
                  </Fragment>
                ))}
              </span>
            ))}
          </p>
          <p className={styles.summary} data-testid="summary">
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
              <a href={pagePath("projects", lang)}>
                {pick(MORE_PROJECTS, lang)} →
              </a>
            </p>
          </section>
        </main>
      </div>
      <Footer lang={lang} />
    </>
  );
}
