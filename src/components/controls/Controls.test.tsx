import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Controls } from "./Controls";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("Controls", () => {
  it("marks what is in use — Italian, and the theme of the system — and remembers a change", async () => {
    render(<Controls />);

    expect(
      screen
        .getAllByRole("button", { pressed: true })
        .map((button) => button.textContent),
    ).toEqual(["IT", "Auto"]);

    await userEvent.click(screen.getByRole("button", { name: "English" }));

    expect({
      pressed: screen
        .getAllByRole("button", { pressed: true })
        .map((button) => button.textContent),
      stored: localStorage.getItem("lang"),
    }).toEqual({ pressed: ["EN", "Auto"], stored: "en" });
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

  it("gives the page back to the system on Auto, forgetting the choice", async () => {
    render(<Controls />);

    await userEvent.click(screen.getByRole("button", { name: /dark/i }));
    await userEvent.click(screen.getByRole("button", { name: /auto/i }));

    expect({
      stamped: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
    }).toEqual({ stamped: undefined, stored: null });
  });
});
