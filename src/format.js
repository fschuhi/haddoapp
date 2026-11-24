// Display helpers: turn values from books.json into the text the page shows.

// Shown in place of a missing part, so "01 / - (3)" still reads as rack / box (position).
const MISSING = '-'

// "rack 01" -> "01", as in the Excel bookshelf sheet.
// A label without digits ("cupboard A") is shown unchanged.
export function shortLabel(label) {
  if (label == null || label === '') return MISSING
  const digits = label.match(/[0-9]+/)
  return digits ? digits[0] : label
}

// The location line: "rack 01", "box 01", 17 -> "01 / 01 (17)".
// The position is only a hint: books get put back in a different order.
export function formatLocation(book) {
  const position = book.position == null ? MISSING : String(book.position)
  return `${shortLabel(book.space_label)} / ${shortLabel(book.bin_label)} (${position})`
}
