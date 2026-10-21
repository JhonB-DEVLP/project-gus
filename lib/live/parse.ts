import { z } from "zod";

// Parses the Hugging Face Hub model list. No `server-only` here, so the
// unit tests can import it; the fetch lives in ./huggingface.ts.

// Only the fields the table shows. Many trending models have no task.
const modelSchema = z.object({
  id: z.string().min(1),
  pipeline_tag: z.string().min(1).nullish(),
  likes: z.number().int().nonnegative(),
  downloads: z.number().int().nonnegative(),
});

export type LiveModel = {
  id: string;
  task: string | null;
  likes: number;
  downloads: number;
};

// The valid items, in order; items that fail the schema are dropped.
// null when the payload isn't a list at all.
export function parseModels(payload: unknown): LiveModel[] | null {
  if (!Array.isArray(payload)) return null;
  return payload.flatMap((item) => {
    const result = modelSchema.safeParse(item);
    if (!result.success) return [];
    const { id, pipeline_tag, likes, downloads } = result.data;
    return [{ id, task: pipeline_tag ?? null, likes, downloads }];
  });
}
