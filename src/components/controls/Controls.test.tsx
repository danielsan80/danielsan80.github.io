import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Controls } from "./Controls";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("Controls", () => {
  it("marks what is in use — Italian, and the light theme — and remembers a change", async () => {
    render(<Controls />);

    expect(
      screen
        .getAllByRole("button", { pressed: true })
        .map((b) => b.textContent),
    ).toEqual(["IT", "Light"]);

    await userEvent.click(screen.getByRole("button", { name: "English" }));

    expect({
      pressed: screen
        .getAllByRole("button", { pressed: true })
        .map((b) => b.textContent),
      stored: localStorage.getItem("lang"),
    }).toEqual({ pressed: ["EN", "Light"], stored: "en" });
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
