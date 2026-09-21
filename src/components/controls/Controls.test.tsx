import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Controls } from "./Controls";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("Controls", () => {
  it("marks the language in use, and remembers the one chosen", async () => {
    render(<Controls />);

    expect(
      screen
        .getAllByRole("button", { pressed: true })
        .map((b) => b.textContent),
    ).toEqual(["EN"]);

    await userEvent.click(screen.getByRole("button", { name: "Italiano" }));

    expect({
      pressed: screen
        .getAllByRole("button", { pressed: true })
        .map((b) => b.textContent),
      stored: localStorage.getItem("lang"),
    }).toEqual({ pressed: ["IT"], stored: "it" });
  });

  it("stamps the chosen theme on the document and remembers it", async () => {
    render(<Controls />);

    await userEvent.click(screen.getByRole("button", { name: /dark/i }));

    expect({
      stamped: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
    }).toEqual({ stamped: "dark", stored: "dark" });
  });

  it("goes back to the light theme when asked again", async () => {
    render(<Controls />);

    await userEvent.click(screen.getByRole("button", { name: /dark/i }));
    await userEvent.click(screen.getByRole("button", { name: /light/i }));

    expect({
      stamped: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
    }).toEqual({ stamped: "light", stored: "light" });
  });
});
