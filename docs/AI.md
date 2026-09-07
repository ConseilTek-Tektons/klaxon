# Response copilot and grounded retrieval

Klaxon's copilot explains alert grouping, on-call state, incident facts, and approved runbooks. `POST /api/assistant` requires `assistant.ask`, validates input, and enforces a distributed per-user rate limit.

## Runtime modes

1. **Local grounded mode** ranks the bundled incident-operations corpus without an external service.
2. **OpenAI Responses mode** uses `OPENAI_API_KEY` with `store: false` and the retrieved context.
3. **Hosted RAG mode** adds `OPENAI_VECTOR_STORE_ID` for `file_search` over approved runbooks in `knowledge/`.

Run `OPENAI_API_KEY='<key>' pnpm knowledge:ingest` to prepare the optional vector store.

## Incident safeguards

- Answers cite runbooks or incident evidence and distinguish observation from inference.
- Tenant scope and role checks happen before context assembly.
- The assistant cannot acknowledge or resolve alerts, send pages, change severity, or assign command.
- Draft incident summaries require a human review.
- Secrets, provider credentials, and unnecessary responder data stay out of the corpus and logs.
