import { Controls } from "../../components/controls/Controls";
import { identity } from "../../content/identity";
import { pick, type Lang } from "../../content/localized";
import { projects } from "../../content/projects";
import { periodLabel } from "../../content/time/labels";
import { repositorySearch, topics } from "../../content/topics";
import { pagePath } from "../../site/paths";
import styles from "./ProjectsPage.module.css";

const PROJECTS = { it: "Progetti", en: "Projects" };
const ON_GITHUB = { it: "Su GitHub", en: "On GitHub" };
const ROLES = {
  author: { it: "autore", en: "author" },
  contributor: { it: "collaboratore", en: "contributor" },
};

export function ProjectsPage({ lang }: { lang: Lang }) {
  return (
    <div className={styles.page}>
      <Controls page="projects" lang={lang} />

      <header className={styles.heading}>
        <a className={styles.home} href={pagePath("home", lang)}>
          {identity.name}
        </a>
        <h1 className={styles.title} id="projects">
          {pick(PROJECTS, lang)}
        </h1>
      </header>

      <main>
        <section className={styles.projects} aria-labelledby="projects">
          {projects.map((project) => (
            <article
              key={project.name}
              className={styles.project}
              aria-label={project.name}
            >
              <h2 className={styles.projectName}>{project.name}</h2>
              <p className={styles.meta} data-testid="meta">
                {pick(ROLES[project.role], lang)} ·{" "}
                {periodLabel(project.period, lang)}
              </p>
              <p className={styles.summary}>
                {pick(project.channels.site, lang)}
              </p>
              <ul className={styles.links}>
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.topics} aria-labelledby="topics">
          <h2 className={styles.sectionTitle} id="topics">
            {pick(ON_GITHUB, lang)}
          </h2>

          <ul className={styles.topicList}>
            {topics.map((topic) => (
              <li key={topic.query}>
                <a href={repositorySearch(topic.query)}>
                  {pick(topic.label, lang)}
                </a>{" "}
                <span>{pick(topic.description, lang)}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
