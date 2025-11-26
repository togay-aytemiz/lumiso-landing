# Legal markdowns

This folder holds the canonical legal markdown files (KVKK, privacy, terms, DPA, etc.). They will be read during the static build to generate:
- Public pages such as `/terms`, `/privacy`, `/kvkk`, `/dpa`.
- A JSON manifest (e.g. `public/legal_versions.json`) that exposes `id`, `version`, and `last_updated` for the CRM signup flow.

Suggested filenames (one per document): `terms.md`, `privacy.md`, `kvkk.md`, `dpa.md`, `abroad_consent.md`. Use the same slug in the frontmatter `id`.

Each markdown file should start with this frontmatter:

```markdown
---
id: "kvkk"
version: "v1.1"
last_updated: "2025-02-01"
document_title: "KVKK Aydınlatma Metni"
---
```

- `id`: slug/key used in the JSON (e.g. `kvkk`, `terms`).
- `version`: string, keep `vX.Y` style.
- `last_updated`: ISO date `YYYY-MM-DD`.
- `document_title`: heading to render on the page.

Markdown content goes below the frontmatter. The build step can later scan `/legal/*.md` to emit `public/legal_versions.json` and render the static pages.
