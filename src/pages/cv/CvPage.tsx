import { useEffect } from "react";
import { Controls } from "../../components/controls/Controls";
import { useLang } from "../../components/controls/preferences";
import { Marker } from "../../components/skills/Marker";
import { Lane } from "../../components/timeline/Lane";
import { domainOf } from "../../components/timeline/placement";
import { contact } from "../../content/contact";
import { education } from "../../content/education";
import { experiences } from "../../content/experiences";
import { identity } from "../../content/identity";
import { pick } from "../../content/localized";
import { profiles } from "../../content/profiles";
import { projects } from "../../content/projects";
import { skills } from "../../content/skills";
import { periodLabel } from "../../content/time/labels";
import type { Period } from "../../content/time/period";
import { training } from "../../content/training";
import styles from "./CvPage.module.css";
import { GitHubIcon, LinkedInIcon, MailIcon, SiteIcon } from "./icons";

const dated = [...experiences, ...education, ...training].map(
  (entry) => entry.period,
);

const profileNamed = (name: string) => {
  const profile = profiles.find((candidate) => candidate.name === name);
  if (!profile) {
    throw new Error(`No ${name} profile to head the CV with`);
  }
  return profile;
};

// The Italian CV keeps the English section names, except this one.
const TRAINING = { it: "Formazione", en: "Training" };

const github = profileNamed("GitHub");
const linkedin = profileNamed("LinkedIn");

// On paper a link is text to type back, so the address is what the CV prints:
// the label lives on the site, where clicking works.
const address = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Read once, not on every render: the positions change with the year, and the
// pre-rendered markup has to match what the browser draws when it hydrates.
const DOMAIN = domainOf(dated, Date.now());

export function CvPage() {
  const [lang] = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const lane = (period: Period) => (
    <Lane period={period} domain={DOMAIN} lang={lang} />
  );

  return (
    <main className={styles.page}>
      <Controls />

      <header className={styles.heading}>
        <h1 className={styles.name}>{identity.name}</h1>
        <p className={styles.headline}>{pick(identity.headline, lang)}</p>
        <p className={styles.contacts}>
          <span>
            <MailIcon />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </span>
          <span>
            <GitHubIcon />
            <a href={github.url}>{github.handle}</a>
          </span>
          <span>
            <LinkedInIcon />
            <a href={linkedin.url}>{address(linkedin.url)}</a>
          </span>
          <span>
            <SiteIcon />
            <a href="https://danilosanchi.net">danilosanchi.net</a>
          </span>
        </p>
      </header>

      <section aria-labelledby="summary">
        <h2 className={styles.section} id="summary">
          Summary
        </h2>
        <p className={styles.summary}>{pick(identity.summary, lang)}</p>
      </section>

      <section aria-labelledby="projects">
        <h2 className={styles.section} id="projects">
          Projects
        </h2>
        <ul className={styles.projects} aria-labelledby="projects">
          {projects.map((project) => (
            <li key={project.name}>
              <b>{project.name}</b> — {pick(project.summary, lang)}
              <span className={styles.projectLinks}>
                {project.links.map((link) => (
                  <a key={link.url} href={link.url}>
                    {address(link.url)}
                  </a>
                ))}
              </span>
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
              <h3 className={styles.role}>{pick(experience.role, lang)}</h3>
              <p className={styles.where}>
                <span>{experience.company}</span>,{" "}
                {pick(experience.location, lang)}
                {experience.remote ? (
                  <>
                    {" · "}
                    <i>remote</i>
                  </>
                ) : null}
              </p>
              <p className={styles.dates}>
                {periodLabel(experience.period, lang)}
              </p>
            </div>
            <ul>
              {pick(experience.channels.cv, lang).map((line) => (
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
          const institution = pick(studies.institution, lang);

          return (
            <article
              className={styles.entry}
              key={institution}
              aria-label={institution}
            >
              {lane(studies.period)}
              <div className={styles.studiesHead}>
                <div>
                  <h3 className={styles.role}>{institution}</h3>
                  <p className={styles.studiesTitle}>
                    {pick(studies.title, lang)}
                  </p>
                </div>
                <div className={styles.aside}>
                  <p>{pick(studies.location, lang)}</p>
                  <p>{periodLabel(studies.period, lang)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="training">
        <h2 className={styles.section} id="training">
          {pick(TRAINING, lang)}
        </h2>
        {training.map((course) => {
          const title = pick(course.title, lang);

          return (
            <article className={styles.entry} key={title} aria-label={title}>
              {lane(course.period)}
              <div className={styles.entryHead}>
                <h3 className={styles.role}>{title}</h3>
                <p className={styles.dates}>
                  {periodLabel(course.period, lang)}
                </p>
              </div>
              <p>{pick(course.note, lang)}</p>
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
            <div key={pick(group.category, lang)}>
              <dt>{pick(group.category, lang)}</dt>
              <dd>
                {group.items.map((skill) => (
                  <span className={styles.skill} key={pick(skill.name, lang)}>
                    <Marker level={skill.level} />
                    {pick(skill.name, lang)}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
