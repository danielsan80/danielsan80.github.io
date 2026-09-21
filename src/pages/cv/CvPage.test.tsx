import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { education } from "../../content/education";
import { experiences } from "../../content/experiences";
import { training } from "../../content/training";
import { CvPage } from "./CvPage";

describe("CvPage", () => {
  it("keeps the sections of the CV, in the order the CV has them", () => {
    render(<CvPage />);

    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Summary",
      "Projects",
      "Experience",
      "Education",
      "Training",
      "Skills",
    ]);
  });

  it("gives every dated entry its own timeline", () => {
    render(<CvPage />);

    expect(screen.getAllByRole("img").length).toBe(
      experiences.length + education.length + training.length,
    );
  });

  it("heads an experience with role, company and dates", () => {
    render(<CvPage />);
    const entry = screen.getByRole("article", { name: "Resolvi Srl" });

    expect({
      role: within(entry).getByRole("heading", { level: 3 }).textContent,
      company: within(entry).getByText("Resolvi Srl").textContent,
      period: within(entry).getByText(/2026/).textContent,
      timeline: within(entry).getByRole("img").getAttribute("aria-label"),
    }).toEqual({
      role: "Consultant & Full Stack Developer",
      company: "Resolvi Srl",
      period: "Aug 2026 - present",
      timeline: "Aug 2026 - present",
    });
  });

  it("prints the bullets written for the CV, not the prose written for LinkedIn", () => {
    render(<CvPage />);
    const entry = screen.getByRole("article", { name: "Resolvi Srl" });

    expect(
      within(entry)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(experiences[0].channels.cv.en);
  });
});
