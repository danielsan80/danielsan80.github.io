import { featuredProjects } from "../../content/projects";
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

      {/* One list, on purpose: the PHP libraries and the RC car timing system
          are the same habit in two workshops, not two audiences to split. */}
      <section className={styles.projects} aria-labelledby="projects">
        <h2 className={styles.sectionTitle} id="projects">
          Projects
        </h2>

        <ul className={styles.projectList}>
          {featuredProjects.map((project) => (
            <li key={project.name}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <p className={styles.projectSummary}>{project.summary}</p>
              <ul className={styles.projectLinks}>
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a className={styles.mono} href={link.url}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
