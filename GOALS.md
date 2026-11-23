# haddoapp -- Goals and Roadmap

(Note: "I" in the following paragraphs refer to the user, "you" to you as the AI model.)

**Charter:** This file answers: where is the project going, in what order, and what happens next. It holds the strategic vision, the phased roadmap, and goals that need a strategy discussion before they are actionable. The _Current Session Pointer_ below is the single canonical "where we are / what's next" -- keep it to a few lines, update it, don't grow it; `FIRST_PROMPT.md` sends the reader here first. Concrete, startable work lives in `TODO.md`; the resolved-work record lives in `HISTORY.md` (on the heap, out of the per-session dump); architecture and contract live in `README.md`.

---

## 📍 Current Session Pointer

**Where we are:** On the Mac, the app works end to end: `make export` writes `books.json` from the database copy, and `make dev` shows all books as a grid of covers in shelf order, with ISBN, location and tags below each cover. Python and JavaScript tests are all green. Nothing is on the NAS yet.

**What's next:** The NAS (roadmap step 2): build the app with `make build`, serve it with nginx in a Docker container, put `covers/` and `photos/` next to it, and open it on the iPhone.

---

## 🎯 Strategic vision

A read-only browser for the home library on the phone: browse the shelves by cover, narrow them down by tag, author or title, and see where a book stands. The data stays in `haddolib`; haddoapp picks up its changes through the export. Writing from the phone comes after the deadline.

**Deadlines:** target Tuesday, 22 December 2026; hard deadline Thursday, 24 December 2026.

---

## Roadmap

1. **Mac prototype** -- done, 22-23 November 2026: export, grid of covers, information line below each cover.
2. **On the NAS:** `make build`, an nginx container serving the app, covers and photos on the NAS (the photos still need copying), an icon on the iPhone home screen ("Add to Home Screen").
3. **Filtering** by tag, author and title.
4. **Zoom** into a cover.
5. **Ready by the deadline:** a final export that includes the books added in the meantime, and a check on the phones.
6. **After the deadline:** more rooms first, then tagging from the phone through a small server. Better cover images, to be worked out between `haddolib` and haddoapp.
