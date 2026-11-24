import { shortLabel } from './format.js'

// The rows of the book page: the fields of one book from books.json, each with a German
// caption. Generic on purpose: a field that the export adds later shows up without a change here.

// Fields the book page does not show as a row: book_id is only an internal number,
// and the cover is shown as a picture, not as its file name.
export const HIDDEN_FIELDS = ['book_id', 'cover_file']

// The German caption in front of each value. A field without a caption here shows its
// key from books.json instead, e.g. "publisher"; adding the caption is then one line.
export const FIELD_CAPTIONS = {
  isbn13: 'ISBN',
  title: 'Titel',
  authors: 'Autoren',
  room: 'Raum',
  space_label: 'Regal',
  bin_label: 'Fach',
  position: 'Position',
  tags: 'Tags',
}

// True if a value has nothing to show: null, empty text, or no tags.
function isEmpty(value) {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0)
}

// The value as text, the way the book page shows it.
function displayValue(key, value) {
  // As in the grid: "rack 02" -> "02", "box 01" -> "01"
  if (key === 'space_label' || key === 'bin_label') return shortLabel(value)
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

// The rows for one book, as { caption, value }, in the order of the fields in books.json.
// Hidden and empty fields are left out, so a book with little information gets few rows.
export function bookPageRows(book) {
  return Object.entries(book)
    .filter(([key, value]) => !HIDDEN_FIELDS.includes(key) && !isEmpty(value))
    .map(([key, value]) => ({
      caption: FIELD_CAPTIONS[key] ?? key,
      value: displayValue(key, value),
    }))
}
