import { describe, expect, it } from "vitest";
import { injectMarkup, renderPages, unstyledClasses } from "./prerender.mjs";

const FIXTURE = {
  html: "fixture.html",
  module: "/tools/fixtures/FixturePage.tsx",
  component: "FixturePage",
};

describe("injectMarkup", () => {
  it("fills the empty root element, leaving the rest of the document alone", () => {
    expect(
      injectMarkup(
        '<html><head><title>Home</title></head><body><div id="root"></div></body></html>',
        "<main>Hello</main>",
      ),
    ).toBe(
      '<html><head><title>Home</title></head><body><div id="root"><main>Hello</main></div></body></html>',
    );
  });

  it("refuses a template without the root element, instead of writing a page nobody would notice is empty", () => {
    expect(() => injectMarkup("<html><body></body></html>", "<main/>")).toThrow(
      'Missing <div id="root"></div> in the page template',
    );
  });
});

describe("renderPages", () => {
  it("renders a page module to markup, TSX and CSS module classes included", async () => {
    const rendered = await renderPages([FIXTURE]);

    expect(
      rendered.map(({ html, markup }) => [html, scrubHashes(markup)]),
    ).toEqual([
      ["fixture.html", '<p class="_box_HASH">Rendered without a browser.</p>'],
    ]);
  });

  it("refuses a page whose module does not export the component it names", async () => {
    await expect(
      renderPages([{ ...FIXTURE, component: "Missing" }]),
    ).rejects.toThrow("/tools/fixtures/FixturePage.tsx has no export Missing");
  });
});

describe("unstyledClasses", () => {
  it("lists the classes the markup uses and the stylesheet never defines", () => {
    expect(
      unstyledClasses(
        '<main class="_page_a1 _wide_b2"><p class="_note_c3">hi</p></main>',
        "._page_a1{margin:0}._note_c3{color:red}",
      ),
    ).toEqual(["_wide_b2"]);
  });

  it("says nothing when the stylesheet covers the markup", () => {
    expect(
      unstyledClasses(
        '<main class="_page_a1">hi</main>',
        "._page_a1{margin:0}._note_c3{color:red}",
      ),
    ).toEqual([]);
  });
});

// Vite derives CSS module class names from the file's path and content. What
// matters here is that the class came out scoped, not what the hash was.
function scrubHashes(markup) {
  return markup.replace(/(_[A-Za-z]+)_[a-z0-9]+_\d+/g, "$1_HASH");
}
