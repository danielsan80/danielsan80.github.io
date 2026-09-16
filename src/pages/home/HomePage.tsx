import { contact } from "../../content/contact";
import { identity } from "../../content/identity";
import { profiles } from "../../content/profiles";
import { pick } from "../../content/localized";
import { featuredProjects } from "../../content/projects";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.page}>
      <main>
        <header className={styles.intro}>
          <h1 className={styles.name}>{identity.name}</h1>
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

        <section className={styles.projects} aria-labelledby="projects">
          <h2 className={styles.sectionTitle} id="projects">
            Projects
          </h2>

          <ul className={styles.projectList}>
            {featuredProjects.map((project) => (
              <li key={project.name}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectSummary}>
                  {pick(project.summary, "en")}
                </p>
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

      <footer className={styles.footer}>
        <h2 className={styles.sectionTitle}>Elsewhere</h2>

        <ul className={styles.profiles}>
          {profiles.map((profile) => (
            <li key={profile.url}>
              <a href={profile.url}>{profile.name}</a>{" "}
              <span className={styles.mono}>{profile.handle}</span>
            </li>
          ))}
        </ul>

        <p className={styles.contact}>
          <a className={styles.mono} href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </p>
      </footer>
    </div>
  );
}
