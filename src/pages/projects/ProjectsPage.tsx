import { useEffect } from "react";
import { Controls } from "../../components/controls/Controls";
import { useLang } from "../../components/controls/preferences";
import { identity } from "../../content/identity";
import { pick } from "../../content/localized";
import { listedProjects } from "../../content/projects";
import { periodLabel } from "../../content/time/labels";
import { repositorySearch, topics } from "../../content/topics";
import styles from "./ProjectsPage.module.css";

const PROJECTS = { it: "Progetti", en: "Projects" };
const ON_GITHUB = { it: "Su GitHub", en: "On GitHub" };
const ROLES = {
  author: { it: "autore", en: "author" },
  contributor: { it: "collaboratore", en: "contributor" },
};

export function ProjectsPage() {
  const [lang] = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={styles.page}>
      <Controls />

      <header className={styles.heading}>
        <a className={styles.home} href="/">
          {identity.name}
        </a>
        <h1 className={styles.title} id="projects">
          {pick(PROJECTS, lang)}
        </h1>
      </header>

      <main>
        <section className={styles.projects} aria-labelledby="projects">
          {listedProjects.map((project) => (
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
              <p className={styles.summary}>{pick(project.summary, lang)}</p>
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
