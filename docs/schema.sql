CREATE TABLE book (
    book_id            INTEGER PRIMARY KEY,        -- surrogate identity / merge anchor
    isbn13             TEXT UNIQUE,                -- business key; NULL for photo / pre-ISBN books
                                                   -- UNIQUE guards against accidental double-adds
    book_note          TEXT,                       -- free fact: "annotated", "Cover fehlt" — edited in place, spawns no row
    book_status        TEXT,                       -- OPEN-TEXT non-cover workflow indicator (the "pile shrinking" field)

    -- location, fused inline (no movement history in the prototype) -----------
    room               TEXT,                       -- 'Magazin', 'Wohnzimmer', …
    space_label        TEXT,                       -- 'rack 03', 'cupboard A'
    bin_label          TEXT,                       -- box '01'..'25'; NULL where the space has no bins
    position           REAL,                       -- sortable order within the bin; REAL so 1.5 slots between 1 and 2

    preferred_cover_id INTEGER REFERENCES cover(cover_id) ON DELETE SET NULL,  -- which cover the views show
    created_at         TEXT NOT NULL,
    CHECK (isbn13 IS NULL OR length(isbn13) = 13)
) STRICT;
CREATE INDEX ix_book_isbn13 ON book(isbn13);
CREATE TABLE book_revision (
    revision_id        INTEGER PRIMARY KEY,
    book_id            INTEGER NOT NULL REFERENCES book(book_id),

    source             TEXT NOT NULL,              -- OPEN TEXT: 'isbndb','openlibrary','photosearch','manual', …
    revision_comment   TEXT,                       -- optional: why this revision exists
    created_at         TEXT NOT NULL,

    -- bibliographic snapshot (mirrors the ISBNdb / photosearch sheet fields) --
    title              TEXT,
    title_long         TEXT,
    subtitle           TEXT,
    authors            TEXT,                       -- comma-delimited, as the API gives
    publisher          TEXT,
    date_published     TEXT,                       -- mixed forms from the API ('2020-09', '2025')
    edition            TEXT,                       -- ISBNdb's "edition" field
    pages              INTEGER,
    binding            TEXT,
    language           TEXT,
    dimensions         TEXT,                       -- raw dimensions string
    height_cm          REAL,
    length_cm          REAL,
    width_cm           REAL,
    weight_kg          REAL,
    subjects           TEXT,                       -- ISBNdb subjects (NB: not your personal tags)
    dewey_decimal      TEXT,
    isbn10             TEXT                        -- retained for the legacy bridge / reference
) STRICT;
CREATE INDEX ix_revision_book ON book_revision(book_id, created_at);
CREATE TABLE cover (
    cover_id           INTEGER PRIMARY KEY,
    book_id            INTEGER NOT NULL REFERENCES book(book_id),
    cover_ref          TEXT NOT NULL,              -- the URL, or a directly-supplied file path
    cover_source       TEXT,                       -- OPEN TEXT: 'isbndb','amazon','thalia','own_photo', … (optional)
    cover_status       TEXT DEFAULT 'unreviewed',  -- OPEN TEXT cover workflow; default is just the ingest entry state
    created_at         TEXT NOT NULL
) STRICT;
CREATE INDEX ix_cover_book ON cover(book_id);
CREATE TABLE tag (
    tag_id   INTEGER PRIMARY KEY,
    name     TEXT NOT NULL UNIQUE
) STRICT;
CREATE TABLE book_tag (
    book_id  INTEGER NOT NULL REFERENCES book(book_id),
    tag_id   INTEGER NOT NULL REFERENCES tag(tag_id),
    PRIMARY KEY (book_id, tag_id)
) STRICT, WITHOUT ROWID;
CREATE VIEW book_current AS
SELECT b.book_id,
       b.isbn13,
       r.source             AS revision_source,
       r.revision_comment,
       r.created_at         AS revised_at,
       r.title, r.title_long, r.subtitle, r.authors, r.publisher,
       r.date_published, r.edition, r.pages, r.binding, r.language,
       r.dimensions, r.height_cm, r.length_cm, r.width_cm, r.weight_kg,
       r.subjects, r.dewey_decimal, r.isbn10,
       b.book_note, b.book_status,
       b.room, b.space_label, b.bin_label, b.position,
       cov.cover_ref,
       cov.cover_source,
       cov.cover_status
FROM book AS b
LEFT JOIN (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY book_id
               ORDER BY created_at DESC, revision_id DESC
           ) AS rn
    FROM book_revision
) AS r ON r.book_id = b.book_id AND r.rn = 1
LEFT JOIN cover AS cov ON cov.cover_id = b.preferred_cover_id
/* book_current(book_id,isbn13,revision_source,revision_comment,revised_at,title,title_long,subtitle,authors,publisher,date_published,edition,pages,binding,language,dimensions,height_cm,length_cm,width_cm,weight_kg,subjects,dewey_decimal,isbn10,book_note,book_status,room,space_label,bin_label,position,cover_ref,cover_source,cover_status) */;
