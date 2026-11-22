"""Export books.json for haddoapp from a copy of the haddolib database.

Usage: export_books.py DB BOOKS

Reads the view book_current (one row per book) and the tags (book_tag + tag),
and writes one JSON list with one object per book, in shelf order. The
database is opened read-only, so this script cannot change the copy.
"""

import json
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

# Folders the app expects next to its index.html. On the Mac they are
# symlinks in public/; on the NAS they will be folders next to the app.
COVERS_FOLDER = "covers"
PHOTOS_FOLDER = "photos"

# Shelf order: room, then space (rack), bin (box), position. book_id last,
# so two books with the same position still come out in a stable order.
BOOKS_QUERY = """
    SELECT book_id, isbn13, title, authors,
           room, space_label, bin_label, position,
           cover_ref
    FROM book_current
    ORDER BY room, space_label, bin_label, position, book_id
"""

TAGS_QUERY = """
    SELECT bt.book_id, t.name
    FROM book_tag AS bt
    JOIN tag AS t ON t.tag_id = bt.tag_id
"""


def cover_file_from_ref(cover_ref):
    """Turn a cover_ref from the database into a path relative to the app.

    - A URL (from ISBNdb): the last part of the URL, in covers/.
      'https://images.isbndb.com/covers/123.jpg' -> 'covers/123.jpg'
    - Anything else (own photo): the file name unchanged, in photos/.
      'rack_01 2026-02-16 21.29.43.jpg' -> 'photos/rack_01 2026-02-16 21.29.43.jpg'
    - No cover_ref: None, and the app shows a placeholder.

    Spaces stay as they are here; the app encodes them when it builds the
    image address.
    """
    if not cover_ref:
        return None
    if cover_ref.startswith(("http://", "https://")):
        return f"{COVERS_FOLDER}/{cover_ref.rsplit('/', 1)[-1]}"
    return f"{PHOTOS_FOLDER}/{cover_ref}"


def open_read_only(db_path):
    """Open the database so that any attempt to write fails."""
    # mode=ro needs the path as a file: URI; as_uri() also encodes spaces.
    uri = Path(db_path).resolve().as_uri() + "?mode=ro"
    return sqlite3.connect(uri, uri=True)


def read_books(connection):
    """Return all books as a list of dicts, in shelf order."""
    # Tags live in their own tables (a book has zero to many), so they are
    # read separately and attached per book.
    tags_by_book = {}
    for book_id, name in connection.execute(TAGS_QUERY):
        tags_by_book.setdefault(book_id, []).append(name)

    books = []
    for row in connection.execute(BOOKS_QUERY):
        (
            book_id,
            isbn13,
            title,
            authors,
            room,
            space_label,
            bin_label,
            position,
            cover_ref,
        ) = row
        books.append(
            {
                "book_id": book_id,
                "isbn13": isbn13,
                "title": title,
                "authors": authors,
                "room": room,
                "space_label": space_label,
                "bin_label": bin_label,
                "position": position,
                # Sorted by name, ignoring upper/lower case.
                "tags": sorted(tags_by_book.get(book_id, []), key=str.casefold),
                "cover_file": cover_file_from_ref(cover_ref),
            }
        )
    return books


def main(argv):
    if len(argv) != 3:
        print("Usage: export_books.py DB BOOKS", file=sys.stderr)
        return 2
    db_path, books_path = Path(argv[1]), Path(argv[2])

    # closing(): "with connection" alone would not close it, only end a transaction.
    with closing(open_read_only(db_path)) as connection:
        books = read_books(connection)

    books_path.parent.mkdir(parents=True, exist_ok=True)
    # ensure_ascii=False keeps umlauts readable; indent makes the file easy to inspect.
    text = json.dumps(books, ensure_ascii=False, indent=2)
    books_path.write_text(text + "\n", encoding="utf-8")
    print(f"Exported {len(books)} books to {books_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
