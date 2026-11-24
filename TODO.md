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

- A name instead of the address in Safari's address bar, e.g. `haddolib` or `haddolib:8080`. _Needs investigation_

## Browsing (roadmap step 3)

- Filter by room, or show the room; so far "Magazin" is the only one.
- Sort with German rules, umlauts with their base letters. Tags are sorted by character code now, so "Ästhetik" comes after "Zoologie". Probably in the app with `Intl.Collator('de')`, together with sorting by title and author.
- Filter controls that leave the screen to the covers: research and brainstorm patterns (field hidden above the top that a pull-down reveals, a bar that hides on scroll-down and comes back on scroll-up, a floating button that opens the filters, a see-through "glass" bar). _Needs investigation_

## Book details

- Tap a cover to see everything `books.json` has on the book (roadmap step 4).
- Synopses: one text file per book in a folder `synopses/`, next to `covers/` and `photos/`, easy to edit by hand; the app loads one when the book details open. No column in the database, no field in `books.json`. ISBNdb gives the synopsis only one book at a time, not in bulk (low priority; the 500+ books still to be catalogued come first). How the files are named (`book_id` or ISBN; not every book has an ISBN) and who writes them: _Needs investigation_
- A free-text field per book, for both of us: anything worth knowing about the book. A new field; not `book_note`, which belongs to the Excel workflow. First from the Excel workbench to the app, later also from the app back to the database. Name and architecture: _Needs investigation_

## Display

- Revisit the grey 2:3 frames around the covers (low priority): rows line up nicely, but oddly shaped books are memorable exactly because they are odd.
- Books without an ISBN: show the photo file name in its place, as the Excel sheet does; it helps when maintaining the catalogue (low priority).
- A cover file missing on disk shows the browser's broken-image icon. How many are missing, and should the empty frame show instead? _Needs investigation_

## Covers (`haddolib` or haddoapp?)

- ISBNdb covers are often missing or wrong. Own photos stand in for some of them, but their quality is poor; better covers from other sources should replace them one by one. The file names of own photos contain the rack number, which can change. Where do sourcing and naming of covers belong, in `haddolib` or in haddoapp? _Needs investigation_
- In the Excel sheet, a book whose cover is not a URL shows its photo name instead of the ISBN. That rule breaks once ISBNs come from sources other than ISBNdb (a `haddolib` matter).

## Done this session

- ~~Filter by tag, author and title~~ -- one filter field above the grid; every typed word must appear in the title, the authors or a tag (`src/filter.js`).
- ~~Zoom into a cover~~ -- pinch-zoom in Safari is enough.
