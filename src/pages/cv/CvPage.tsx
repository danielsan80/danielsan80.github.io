import { Lane } from "../../components/timeline/Lane";
import { domainOf } from "../../components/timeline/placement";
import { contact } from "../../content/contact";
import { education } from "../../content/education";
import { experiences } from "../../content/experiences";
import { identity } from "../../content/identity";
import { pick } from "../../content/localized";
import { featuredProjects } from "../../content/projects";
import { skills } from "../../content/skills";
import { periodLabel } from "../../content/time/labels";
import type { Period } from "../../content/time/period";
import { training } from "../../content/training";
import styles from "./CvPage.module.css";

const LANG = "en";

const dated = [...experiences, ...education, ...training].map(
  (entry) => entry.period,
);

// Read once, not on every render: the positions change with the year, and the
// pre-rendered markup has to match what the browser draws when it hydrates.
const DOMAIN = domainOf(dated, Date.now());

export function CvPage() {
  const lane = (period: Period) => (
    <Lane period={period} domain={DOMAIN} lang={LANG} />
  );

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <h1 className={styles.name}>{identity.name}</h1>
        <p className={styles.headline}>{pick(identity.headline, LANG)}</p>
        <p className={styles.contacts}>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span className={styles.mono}>danielsan80</span>
          <a href="https://danilosanchi.net">danilosanchi.net</a>
        </p>
      </header>

      <section aria-labelledby="summary">
        <h2 className={styles.section} id="summary">
          Summary
        </h2>
        <p>{pick(identity.summary, LANG)}</p>
      </section>

      <section aria-labelledby="projects">
        <h2 className={styles.section} id="projects">
          Projects
        </h2>
        <ul className={styles.projects}>
          {featuredProjects.map((project) => (
            <li key={project.name}>
              <b>{project.name}</b> — {pick(project.summary, LANG)}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="experience">
        <h2 className={styles.section} id="experience">
          Experience
        </h2>
        {experiences.map((experience) => (
          <article
            className={styles.entry}
            key={`${experience.company}-${experience.period.start}`}
            aria-label={experience.company}
          >
            {lane(experience.period)}
            <div className={styles.entryHead}>
              <h3 className={styles.role}>{pick(experience.role, LANG)}</h3>
              <p className={styles.where}>
                <span>{experience.company}</span>,{" "}
                {pick(experience.location, LANG)}
                {experience.remote ? " — remote" : ""}
              </p>
              <p className={styles.dates}>
                {periodLabel(experience.period, LANG)}
              </p>
            </div>
            <ul>
              {pick(experience.channels.cv, LANG).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="education">
        <h2 className={styles.section} id="education">
          Education
        </h2>
        {education.map((studies) => {
          const institution = pick(studies.institution, LANG);

          return (
            <article
              className={styles.entry}
              key={institution}
              aria-label={institution}
            >
              {lane(studies.period)}
              <div className={styles.entryHead}>
                <h3 className={styles.role}>{institution}</h3>
                <p className={styles.where}>{pick(studies.location, LANG)}</p>
                <p className={styles.dates}>
                  {periodLabel(studies.period, LANG)}
                </p>
              </div>
              <p>{pick(studies.title, LANG)}</p>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="training">
        <h2 className={styles.section} id="training">
          Training
        </h2>
        {training.map((course) => {
          const title = pick(course.title, LANG);

          return (
            <article className={styles.entry} key={title} aria-label={title}>
              {lane(course.period)}
              <div className={styles.entryHead}>
                <h3 className={styles.role}>{title}</h3>
                <p className={styles.dates}>
                  {periodLabel(course.period, LANG)}
                </p>
              </div>
              <p>{pick(course.note, LANG)}</p>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="skills">
        <h2 className={styles.section} id="skills">
          Skills
        </h2>
        <dl className={styles.skills}>
          {skills.map((group) => (
            <div key={pick(group.category, LANG)}>
              <dt>{pick(group.category, LANG)}</dt>
              <dd>
                {group.items.map((skill) => pick(skill.name, LANG)).join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
