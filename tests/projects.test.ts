import { describe, expect, it } from "vitest";
import { getAdjacent, getProject, projects } from "@/content/projects";
import { locales } from "@/lib/i18n";

// Every string inside a value, at any depth.
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value === null || typeof value !== "object") return [];
  return Object.values(value).flatMap(strings);
}

describe("content/projects", () => {
  it("has the three projects with unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(slugs).toEqual(["zapichat", "leia", "nextech"]);
  });

  it("numbers the parts PRJ-01, PRJ-02, PRJ-03 in order", () => {
    expect(projects.map((project) => project.code)).toEqual(["PRJ-01", "PRJ-02", "PRJ-03"]);
  });

  it.each(projects.map((project) => [project.slug, project] as const))(
    "%s has the same structure in EN and PT",
    (_, project) => {
      const { en, pt } = project.copy;
      expect(pt.specs.map((row) => row.key)).toEqual(en.specs.map((row) => row.key));
      expect(pt.figures).toHaveLength(en.figures.length);
      expect(pt.built.items).toHaveLength(en.built.items.length);
      expect(pt.decisions).toHaveLength(en.decisions.length);
    },
  );

  it.each(projects.flatMap((project) => locales.map((lang) => [project.slug, lang, project] as const)))(
    "%s (%s) has no empty strings and at least one figure",
    (_, lang, project) => {
      const copy = project.copy[lang];
      for (const text of strings(copy)) expect(text.trim()).not.toBe("");
      expect(copy.figures.length).toBeGreaterThan(0);
      expect(copy.decisions.length).toBeGreaterThan(0);
    },
  );

  it.each(projects.map((project) => [project.slug, project] as const))(
    "%s has a screenshot for every figure and a thumbnail",
    (_, project) => {
      expect(project.images).toHaveLength(project.copy.en.figures.length);
      for (const image of project.images ?? []) expect(image?.src).toBeTruthy();
      expect(project.thumbnail).toBeTruthy();
    },
  );

  it("finds a project by slug and nothing for an unknown one", () => {
    expect(getProject("leia")?.name).toBe("Léia");
    expect(getProject("does-not-exist")).toBeUndefined();
    expect(getAdjacent("does-not-exist")).toBeUndefined();
  });

  it("wraps previous and next around the list", () => {
    expect(getAdjacent("leia")).toMatchObject({ previous: { slug: "zapichat" }, next: { slug: "nextech" } });
    expect(getAdjacent("zapichat")?.previous.slug).toBe("nextech");
    expect(getAdjacent("nextech")?.next.slug).toBe("zapichat");
  });
});
