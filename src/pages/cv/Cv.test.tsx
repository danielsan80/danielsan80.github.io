import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { education } from "../../content/education";
import { experiences } from "../../content/experiences";
import { projects } from "../../content/projects";
import { training } from "../../content/training";
import { Cv } from "./Cv";
import { CvPage } from "./Cv.page";

const cvPage = new CvPage();

describe("Cv", () => {
  it("keeps the sections of the CV, in the order the CV has them", () => {
    render(<Cv lang="it" />);

    expect(cvPage.sectionTitles()).toEqual([
      "Summary",
      "Projects",
      "Experience",
      "Education",
      "Formazione",
      "Skills",
    ]);
  });

  it("heads the page with the contacts, the handle linked to its profile", () => {
    render(<Cv lang="it" />);

    expect(cvPage.contacts()).toEqual([
      {
        text: "mario.rossi@example.com",
        href: "mailto:mario.rossi@example.com",
      },
      { text: "mariorossi", href: "https://example.com/github/mariorossi" },
      {
        text: "example.com/linkedin/mario-rossi-idraulico",
        href: "https://www.example.com/linkedin/mario-rossi-idraulico/",
      },
      {
        text: "mariorossi.example.com",
        href: "https://mariorossi.example.com/",
      },
    ]);
  });

  it("describes each project with the text written for the CV", () => {
    render(<Cv lang="it" />);
    const openings = projects.map(
      (project) => `${project.name} — ${project.channels.cv.it}`,
    );

    expect(
      cvPage.projects
        .entries()
        .map((entry, index) => entry?.slice(0, openings[index].length)),
    ).toEqual(openings);
  });

  it("tells where to find each project with the links from the content, showing the address itself, so it can be read off paper and typed back", () => {
    render(<Cv lang="it" />);

    expect(cvPage.projects.links()).toEqual([
      {
        text: "example.com/github/mariorossi/sifone-parlante",
        href: "https://example.com/github/mariorossi/sifone-parlante",
      },
      {
        text: "example.com/fontanelle",
        href: "https://example.com/fontanelle",
      },
      {
        text: "example.com/github/openraccordi",
        href: "https://example.com/github/openraccordi",
      },
    ]);
  });

  it("gives every dated entry its own timeline", () => {
    render(<Cv lang="it" />);

    expect(cvPage.timelineCount()).toBe(
      experiences.length + education.length + training.length,
    );
  });

  it("heads an experience with role, company and dates", () => {
    render(<Cv lang="it" />);
    const experience = cvPage.experience("Rossi Consulenze Idrauliche");

    expect({
      role: experience.role(),
      where: experience.where(),
      period: experience.period(),
      timeline: experience.timeline(),
    }).toEqual({
      role: "Consulente idraulico",
      where: "Rossi Consulenze Idrauliche, Borgo Sifone · remote",
      period: "Gen 2026 - oggi",
      timeline: "Gen 2026 - oggi",
    });
  });

  it("prints the bullets written for the CV, not the prose written for LinkedIn", () => {
    render(<Cv lang="it" />);

    expect(cvPage.experience("Rossi Consulenze Idrauliche").bullets()).toEqual(
      experiences[0].channels.cv.it,
    );
  });

  it("speaks English at its English address", () => {
    render(<Cv lang="en" />);
    const experience = cvPage.experience("Rossi Consulenze Idrauliche");

    expect({
      sections: cvPage.sectionTitles(),
      role: experience.role(),
      bullets: experience.bullets(),
    }).toEqual({
      sections: [
        "Summary",
        "Projects",
        "Experience",
        "Education",
        "Training",
        "Skills",
      ],
      role: "Plumbing consultant",
      bullets: experiences[0].channels.cv.en,
    });
  });
});
