# NatesNotes

A minimalist static blog built with [Astro](https://astro.build). Content lives in a
separate Obsidian vault repo ([NatesNotesVault](https://github.com/nathjaco1016/NatesNotesVault));
this repo holds only code and design.

## How content works

- **Notes** are markdown files in the vault's `notes/` folder. Frontmatter is optional
  (`title`, `description`, `date`, `tags`, `draft`) — a bare file still publishes, with
  its title derived from the filename.
- **Courses** are YAML manifests in the vault's `courses/` folder — an ordered playlist
  of note slugs:

  ```yaml
  title: Using This Site
  description: A two-minute tour.
  notes:
    - welcome-to-natesnotes
    - writing-a-note
  ```

  A note can appear in zero or many courses; notes never reference courses. The slug is
  the lowercased, hyphenated filename (`Writing a Note.md` → `writing-a-note`). A manifest
  slug that matches no note fails the build on purpose.

- Routes: `/` (all notes), `/notes/<slug>/` (canonical note page, lists the courses it
  appears in), `/courses/`, `/courses/<course>/` (ordered outline), and
  `/courses/<course>/<slug>/` (the note with prev/next navigation within that course,
  canonical-tagged to the standalone note page).

## Local development

The vault is symlinked in as `content/` (gitignored):

```sh
ln -s ~/Documents/Obsidian/nates-notes content
npm install
npm run dev
```

Edit notes in Obsidian; the dev server picks changes up live.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds on push, on manual dispatch, and whenever the vault
repo fires a `notes-updated` dispatch (see `trigger-site-build.yml` in the vault repo).
One-time setup:

1. Push this repo to `nathjaco1016/NatesNotes`, then in its **Settings → Pages** set
   Source to **GitHub Actions**.
2. In this repo's **Settings → Secrets and variables → Actions**, add `VAULT_TOKEN`: a
   fine-grained PAT with **read** access to `NatesNotesVault` (needed while the vault is
   private).
3. In the vault repo's secrets, add `SITE_DISPATCH_TOKEN`: a fine-grained PAT with
   **contents: read & write** on `NatesNotes`, so pushing a note triggers a site deploy.

The workflow sets `SITE_URL`/`BASE_PATH` for the `github.io/NatesNotes` URL; on a custom
domain, change those env vars in the workflow.
