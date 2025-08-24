# simple-notes-app

Simple Notes App — a minimal, client-side note-taking web app that stores notes in the browser's LocalStorage.

## Features
- Create, edit and delete notes
- Search notes by title or content
- LocalStorage persistence (notes survive page reload)
- Simple, responsive UI using Bootstrap 5
- Lightweight: single-page HTML/CSS/JS (no backend)

## Files
- `index.html` — app UI
- `styles.css` — custom dark theme styles
- `script.js` — app logic (load/save/render notes, notifications)
- `README.md` — this file

## Installation / Run (Windows)
1. Clone or download the project folder to your machine.
2. Serve the folder with a simple web server (recommended — LocalStorage may behave differently when opened via file://):
   - With Python (PowerShell / CMD):
     ```
     py -m http.server 5500
     ```
     or
     ```
     python -m http.server 5500
     ```
   - Or use VS Code Live Server / `npx http-server`:
     ```
     npx http-server -p 5500
     ```
3. Open your browser and go to `http://127.0.0.1:5500/` (or the URL shown by your server).

## Usage
- Click "New Note" to clear editor and start a new note.
- Enter a title and/or content and click "Save Note".
- Click a note in the left list to load it into the editor for editing.
- Click the trash icon on a note to delete it.
- Use the search box to filter notes by title or content.

## Data Storage
Notes are stored in browser LocalStorage under the `notes` key as a JSON array. If LocalStorage is unavailable (e.g. strict browser privacy settings or running from `file://`), the app shows a notification and will not persist data.

## Troubleshooting
- Notes disappear after refresh:
  - Ensure you served the app over `http://` (use a local server) rather than opening `index.html` via `file://`.
  - Check browser DevTools → Application → Local Storage → `notes` to confirm saved data.
- Console errors about `toLowerCase()` or `notes` redeclaration:
  - Make sure `script.js` has a single initialization of `notes` / `currentNoteId` and that notes are normalized before rendering.
- LocalStorage quota / permission errors:
  - Browser may block LocalStorage in private browsing or due to extensions. Try a different browser or disable blocking extensions.

## Contributing
Small fixes and improvements welcome. Open an issue or submit a patch.

## License
MIT —