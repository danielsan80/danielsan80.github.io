import { describe, expect, it } from "vitest";
import { pick } from "./localized";

describe("pick", () => {
  it("reads the requested language out of a localized value", () => {
    expect(pick({ it: "Milano", en: "Milan" }, "en")).toBe("Milan");
  });

  it("returns a plain value untouched, whatever the language", () => {
    expect(pick("PHP", "it")).toBe("PHP");
  });

  it("keeps arrays plain: a list is a value, not a language map", () => {
    expect(pick(["a", "b"], "en")).toEqual(["a", "b"]);
  });
});
