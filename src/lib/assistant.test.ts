import { describe, expect, it } from "vitest";

import { knowledgeArticles } from "../data/knowledge";
import { buildLocalAnswer, retrieveLocalKnowledge } from "./assistant";

describe("local knowledge retrieval", () => {
  it("prioritizes grouping guidance for alert noise", () => {
    const [match] = retrieveLocalKnowledge("How does alert grouping remove noise?", knowledgeArticles);
    expect(match?.id).toBe("alert-grouping");
  });

  it("does not invent an answer when there is no supported match", () => {
    const result = buildLocalAnswer("How do I configure payroll?", knowledgeArticles);
    expect(result.citations).toHaveLength(0);
    expect(result.answer).toContain("could not find");
  });
});
