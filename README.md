# Lift Log

A self-contained workout planner website. It supports:

- Editable training days and exercises
- Exercise GIF/image URLs
- Muscle targets, set/rep ranges, and form cues
- Completion tracking in the browser
- Supplement reference listings with external verification links
- JSON export/import for backups and sharing

## Run locally

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish

This folder can be deployed as a static site on GitHub Pages, Netlify, or Cloudflare Pages.

Edits are stored in each browser's local storage. Use **Share & backup** to export a plan and import it on another device. Real-time shared editing would require a hosted database and authentication.

## Share without a hosting account

Double-click `Share Lift Log.command` on macOS. It starts the website and creates
a temporary public link you can send to friends. Keep its Terminal window open
while the link is in use.

Double-click `Stop Sharing Lift Log.command` to stop sharing.
