# haddoapp -- Goals and Roadmap

(Note: "I" in the following paragraphs refer to the user, "you" to you as the AI model.)

**Charter:** This file answers: where is the project going, in what order, and what happens next. It holds the strategic vision, the phased roadmap, and goals that need a strategy discussion before they are actionable. The _Current Session Pointer_ below is the single canonical "where we are / what's next" -- keep it to a few lines, update it, don't grow it; `FIRST_PROMPT.md` sends the reader here first. Concrete, startable work lives in `TODO.md`; the resolved-work record lives in `HISTORY.md` (on the heap, out of the per-session dump); architecture and contract live in `README.md`.

---

## 📍 Current Session Pointer

**Where we are:** `make deploy` brings the app and `books.json` to the NAS. The nginx container `haddoapp` serves it in the home network on port 8080, with covers and photos straight from the NAS folders. On the iPhone, haddoapp opens from its own icon on the home screen. A filter field above the grid narrows the shelves down by words from title, authors and tags. Tapping a book opens its book page: the cover, then every field `books.json` has; a swipe to the right closes it. The app is presentable. Python and JavaScript tests are all green.

**What's next:** More fields in `books.json` for the book page: which ones, in which order, and whether some rows combine fields, e.g. "Ort" (roadmap step 4).

---

## 🎯 Strategic vision

A read-only browser for the home library on the phone: browse the shelves by cover, narrow them down by tag, author or title, and see where a book stands. The data stays in `haddolib`; haddoapp picks up its changes through the export. Writing from the phone comes after the deadline.

**Deadlines:** target Tuesday, 22 December 2026; hard deadline Thursday, 24 December 2026.

---

## Roadmap

1. **Mac prototype** -- done, 22-23 November 2026: export, grid of covers, information line below each cover.
2. **On the NAS** -- done, 23-24 November 2026: `make deploy`, the nginx container `haddoapp` with covers and photos as read-only mounts, the icon on the iPhone home screen.
3. **Filtering** -- done, 24 November 2026: one filter field for title, authors and tags.
4. **Book details** -- book page done, 24 November 2026: tap a book to see the cover and everything `books.json` has on it. Still open: more fields in `books.json`.
5. **Ready by the deadline:** a final export that includes the books added in the meantime, and a check on the phones.
6. **After the deadline:** more rooms first, then tagging from the phone through a small server. Better cover images, to be worked out between `haddolib` and haddoapp.
