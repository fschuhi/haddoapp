# haddoapp -- TODO

(Note: "I" in the following paragraphs refer to the user, "you" to you as the AI model.)

## Charter

- Forward-looking only -- concrete, startable work: tasks specified well enough that next-session-me can begin within ten minutes, plus investigation items, test specs, and scratchpad ideas awaiting promotion or deletion.
- Items are unordered within their theme sections; open questions are marked _Needs investigation_ in the bullet.
- When an item is completed, record its durable outcome in `HISTORY.md` during the same session while the evidence and rationale are fresh, then strike it through in `TODO.md` with a concise handover note.
- Retain struck-through items through the next session because `TODO.md` is included in the standard filesdump while `HISTORY.md` normally is not; at the end of that next session, remove the already-archived items from `TODO.md`. Strategic direction, ordering, and milestones live in `GOALS.md` -- anything that needs a strategy discussion before it is actionable goes there.
- Architecture, contract, and settled decisions live in `README.md`.

---

## On the NAS (roadmap step 2)

- Deploy the app to the NAS: `make build`, then an nginx container that serves `dist/`. Open question: `make build` copies everything in `public/` into `dist/` and follows the symlinks, so `dist/` would hold all covers (about 104 MB). Copy them along with the app, or let nginx serve the covers folder already on the NAS? _Needs investigation_
- Copy `photos/` to the NAS; so far only `covers/` is there. During big copies, no Finder window may be open on the destination folder.
- An icon on the iPhone home screen ("Add to Home Screen"): find out what the page needs for a proper icon and name. _Needs investigation_
- After `make export`: which files to copy to the NAS, and how (probably only `books.json`).

## Browsing (roadmap steps 3 and 4)

- Filter by tag, author and title.
- Zoom into a cover.
- Filter by room, or show the room; so far "Magazin" is the only one.
- Sort with German rules, umlauts with their base letters. Tags are sorted by character code now, so "Ästhetik" comes after "Zoologie". Probably in the app with `Intl.Collator('de')`, together with sorting by title and author.

## Display

- Revisit the grey 2:3 frames around the covers (low priority): rows line up nicely, but oddly shaped books are memorable exactly because they are odd.
- Books without an ISBN: show the photo file name in its place, as the Excel sheet does; it helps when maintaining the catalogue (low priority).
- A cover file missing on disk shows the browser's broken-image icon. How many are missing, and should the empty frame show instead? _Needs investigation_

## Covers (`haddolib` or haddoapp?)

- ISBNdb covers are often missing or wrong. Own photos stand in for some of them, but their quality is poor; better covers from other sources should replace them one by one. The file names of own photos contain the rack number, which can change. Where do sourcing and naming of covers belong, in `haddolib` or in haddoapp? _Needs investigation_
- In the Excel sheet, a book whose cover is not a URL shows its photo name instead of the ISBN. That rule breaks once ISBNs come from sources other than ISBNdb (a `haddolib` matter).

## Done this session

- ~~Export `books.json` from the database copy~~ -- `scripts/export_books.py` with pytest tests on an invented library; the format is described in `README.md`.
- ~~First page: all books as a grid of covers~~ -- `make dev`, covers through the symlinks in `public/`.
- ~~Information line below each cover~~ -- ISBN, location, tags; `formatLocation` in `src/format.js` with the first Vitest test.
- ~~Project documents~~ -- `README.md` with diagrams, `GOALS.md` with roadmap, this file, `HISTORY.md`.
