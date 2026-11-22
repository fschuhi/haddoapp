"""Tests for scripts/export_books.py.

The tests build a small invented library from docs/schema.sql, so no real
book data ends up in this public repo.
"""

import json
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_SQL = REPO_ROOT / "docs" / "schema.sql"

# scripts/ is a plain folder, not a package, so pytest cannot import from it
# by default. Putting it on the import path here keeps that knowledge in one spot.
sys.path.insert(0, str(REPO_ROOT / "scripts"))

from export_books import (  # noqa: E402
    cover_file_from_ref,
    main,
    open_read_only,
    read_books,
)

# Three invented books, inserted in book_id order but shelved differently:
#   book 1: ISBNdb cover, two tags, rack 02 / box 01 / position 2
#   book 2: own photo as cover, no ISBN, no tags, rack 01 / box 02 / position 1
#   book 3: freshly scanned: no revision, no cover, rack 01 / box 01 / position 1
INVENTED_BOOKS_SQL = """
INSERT INTO book (book_id, isbn13, room, space_label, bin_label, position, created_at) VALUES
    (1, '9780000000002', 'Magazin', 'rack 02', 'box 01', 2.0, '2026-01-01'),
    (2, NULL,            'Magazin', 'rack 01', 'box 02', 1.0, '2026-01-01'),
    (3, '9780000000019', 'Magazin', 'rack 01', 'box 01', 1.0, '2026-01-01');

INSERT INTO book_revision (book_id, source, created_at, title, authors) VALUES
    (1, 'isbndb', '2026-01-02', 'Über Bücher', 'Erika Mustermann'),
    (2, 'manual', '2026-01-02', 'Ein Buch ohne ISBN', 'Max Mustermann');

INSERT INTO cover (cover_id, book_id, cover_ref, cover_source, created_at) VALUES
    (10, 1, 'https://images.isbndb.com/covers/1234567890.jpg', 'isbndb', '2026-01-02'),
    (20, 2, 'rack_01 2026-02-16 21.29.43.jpg', 'own_photo', '2026-01-02');

UPDATE book SET preferred_cover_id = 10 WHERE book_id = 1;
UPDATE book SET preferred_cover_id = 20 WHERE book_id = 2;

INSERT INTO tag (tag_id, name) VALUES (1, 'Physik'), (2, 'Mathematik');
INSERT INTO book_tag (book_id, tag_id) VALUES (1, 1), (1, 2);
"""


@pytest.fixture
def library_path(tmp_path):
    """Path to a temporary database holding the invented library."""
    path = tmp_path / "library.db"
    with closing(sqlite3.connect(path)) as connection:
        connection.executescript(SCHEMA_SQL.read_text(encoding="utf-8"))
        connection.executescript(INVENTED_BOOKS_SQL)
        connection.commit()
    return path


@pytest.fixture
def books(library_path):
    with closing(open_read_only(library_path)) as connection:
        return read_books(connection)


def book_with_id(books, book_id):
    return next(book for book in books if book["book_id"] == book_id)


# --- cover_file_from_ref ---------------------------------------------------


def test_cover_file_from_isbndb_url():
    url = "https://images.isbndb.com/covers/24745893483575.jpg"
    assert cover_file_from_ref(url) == "covers/24745893483575.jpg"


def test_cover_file_from_own_photo_keeps_spaces():
    name = "rack_11 2026-03-03 21.18.54.jpg"
    assert cover_file_from_ref(name) == "photos/rack_11 2026-03-03 21.18.54.jpg"


def test_cover_file_without_cover_ref():
    assert cover_file_from_ref(None) is None
    assert cover_file_from_ref("") is None


# --- read_books ------------------------------------------------------------


def test_books_come_in_shelf_order(books):
    assert [book["book_id"] for book in books] == [3, 2, 1]


def test_book_with_all_fields(books):
    assert book_with_id(books, 1) == {
        "book_id": 1,
        "isbn13": "9780000000002",
        "title": "Über Bücher",
        "authors": "Erika Mustermann",
        "room": "Magazin",
        "space_label": "rack 02",
        "bin_label": "box 01",
        "position": 2.0,
        "tags": ["Mathematik", "Physik"],
        "cover_file": "covers/1234567890.jpg",
    }


def test_own_photo_book_without_isbn(books):
    book = book_with_id(books, 2)
    assert book["isbn13"] is None
    assert book["cover_file"] == "photos/rack_01 2026-02-16 21.29.43.jpg"
    assert book["tags"] == []


def test_book_without_revision_or_cover_is_still_exported(books):
    book = book_with_id(books, 3)
    assert book["isbn13"] == "9780000000019"
    assert book["title"] is None
    assert book["authors"] is None
    assert book["cover_file"] is None
    assert book["tags"] == []


# --- open_read_only --------------------------------------------------------


def test_database_cannot_be_changed(library_path):
    with closing(open_read_only(library_path)) as connection:
        with pytest.raises(sqlite3.OperationalError):
            connection.execute("DELETE FROM book")


# --- main ------------------------------------------------------------------


def test_main_writes_readable_json(library_path, books, tmp_path):
    books_path = tmp_path / "public" / "books.json"

    assert main(["export_books.py", str(library_path), str(books_path)]) == 0

    text = books_path.read_text(encoding="utf-8")
    assert json.loads(text) == books
    assert "Über Bücher" in text  # umlauts stay readable, not Ü...
