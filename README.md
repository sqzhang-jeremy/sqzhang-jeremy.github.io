# Jeremy Zhang — portfolio source

Editable source for https://sqzhang-jeremy.github.io/.

## Build and preview

Requires Node.js 20 or later; no package installation is needed.

```sh
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4173. The generated static site is in `dist/`.

- `scripts/build.mjs`: layouts and page content
- `styles.css`: responsive styles and print layout
- `content/posts.json`: original articles
- `content/legacy-redirects.json`: old URL compatibility
- `assets/`: images and original landscape logo
- `legacy/`: original public media, RSS and search index

## Publishing

GitHub Pages serves the root of `master`. After building and verifying this source branch, copy the contents of `dist/` into a clean checkout of `master`, commit, and push. Do not replace `master` with the source files. Preview and review changes before publication.

## Original website backup

The complete original website is preserved on `codex/backup-original-2026-11-01` at commit `137248f09e18ab1eeba559aa802d10c633b6d74c`. Its previous commit history remains available.

To restore the original site, create a normal new commit on `master` whose file tree matches that backup branch, then push. A force push is not necessary.
