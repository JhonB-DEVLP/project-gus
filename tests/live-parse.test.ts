import { describe, expect, it } from "vitest";
import { parseModels } from "@/lib/live/parse";

const model = (overrides: Record<string, unknown> = {}) => ({
  id: "example-org/chat-model-8b",
  pipeline_tag: "text-generation",
  likes: 1204,
  downloads: 312880,
  // Extra fields from the Hub are ignored.
  trendingScore: 98,
  ...overrides,
});

describe("parseModels", () => {
  it("keeps every valid item, in order, with only the fields we show", () => {
    const items = parseModels([model(), model({ id: "example-org/vision-model-2b", likes: 986 })]);
    expect(items).toEqual([
      { id: "example-org/chat-model-8b", task: "text-generation", likes: 1204, downloads: 312880 },
      { id: "example-org/vision-model-2b", task: "text-generation", likes: 986, downloads: 312880 },
    ]);
  });

  it("drops an item that fails the schema and keeps the rest", () => {
    const items = parseModels([model(), model({ likes: "many" }), model({ id: "example-org/speech-model-v3" })]);
    expect(items?.map((item) => item.id)).toEqual(["example-org/chat-model-8b", "example-org/speech-model-v3"]);
  });

  it.each([
    ["missing id", { id: undefined }],
    ["empty id", { id: "" }],
    ["negative downloads", { downloads: -1 }],
    ["fractional likes", { likes: 1.5 }],
  ])("drops an item with %s", (_, overrides) => {
    expect(parseModels([model(overrides)])).toEqual([]);
  });

  it("accepts a model with no task", () => {
    expect(parseModels([model({ pipeline_tag: undefined })])?.[0]?.task).toBeNull();
    expect(parseModels([model({ pipeline_tag: null })])?.[0]?.task).toBeNull();
  });

  it.each([
    ["an object", { error: "rate limited" }],
    ["a string", "<html>"],
    ["null", null],
  ])("returns null when the payload is %s", (_, payload) => {
    expect(parseModels(payload)).toBeNull();
  });

  it("returns an empty list for an empty array", () => {
    expect(parseModels([])).toEqual([]);
  });
});
