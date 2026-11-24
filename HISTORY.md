# haddoapp -- History

(Note: "I" in the following paragraphs refer to the user, "you" to you as the AI model.)

- The resolved-work record: what was built and when (note date, or have the points in roughly reverse-chronological order).
- This is the trophy case -- kept in the repo, **out of the per-session filesdump** (so it no longer rides along every session).
- For _forward_ work see `TODO.md`; for direction see `GOALS.md`; for the architecture as it stands see `README.md`.
- See "Workflow for the Whole Session (CRITICAL)" in `LLM_INSTRUCTIONS.md` for the interplay between `TODO.md` and this file.

---

- **2026-11-24:** The book page: tap a book, and haddoapp shows everything it knows about it. A swipe to the right brings back the shelf, exactly where it was.
- **2026-11-24:** No more sideways sway: the grid scrolls straight up and down, and a swipe on the book page no longer pushes it aside.
- **2026-11-24:** The filter field: a few words, and the shelves narrow down to the books that have all of them in title, authors or tags. "physik" finds Astrophysik too.
- **2026-11-24:** The Kallax box on the home screen: haddoapp opens from its own icon, at its final address.
- **2026-11-23:** The library on the iPhone, served by the NAS for the first time. An nginx container shows the app; covers and photos come straight from the NAS folders, read-only.
- **2026-11-23:** `make deploy`: one command builds the app, copies it with `books.json` to the NAS, and checks every file byte by byte. The covers stay where they are.
- **2026-11-23:** The README tells how haddoapp hangs together, in three diagrams: from the database copy to the page, one app in two places, and the files inside the app.
- **2026-11-23:** Below each cover, the line I know from Excel: ISBN, rack / box (position), tags. And the first JavaScript test of the project.
- **2026-11-23:** The whole library in the browser: covers side by side, in shelf order, rack 01 first. Flipping through all of it takes a few minutes, and it doesn't look so big after all.
- **2026-11-22:** `make export`: the library leaves Excel. One file with every book, its location, tags and cover, read from a copy of the database that the script cannot change, and tested on an invented library, so no real book ever lands in this repo.
- **2026-11-22:** haddoapp begins: a read-only browser for the home library, on the iPhone. The covers reach the app through two symlinks, without copying a single file.
