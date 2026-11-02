import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";
import { FooterPage } from "./Footer.page";

const footer = new FooterPage();

describe("Footer", () => {
  it("gathers every profile and the way to write", () => {
    render(<Footer lang="it" />);

    expect(footer.links()).toEqual([
      "https://example.com/github/mariorossi",
      "https://www.example.com/linkedin/mario-rossi-idraulico/",
      "mailto:mario.rossi@example.com",
    ]);
  });

  it("shows the handle next to each profile, so the same person is recognisable, and the address last among them", () => {
    render(<Footer lang="it" />);

    expect(footer.entries()).toEqual([
      "GitHub mariorossi",
      "LinkedIn mario-rossi-idraulico",
      "Email mario.rossi@example.com",
    ]);
  });

  it("says where to find me in the language of the page", () => {
    render(<Footer lang="en" />);

    expect(footer.title()).toBe("Find me");
  });
});
