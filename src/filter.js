// The filter: which books stay in the grid while the user types into the filter field.

// Both sides are brought into the same form before they are compared:
// - lower case, so "physik" finds "Physik"
// - NFC, so a "ü" stored as "u" plus a separate dots character still matches the
//   one-character "ü" that the iPhone keyboard types. books.json uses the one-character
//   form today; this keeps the filter working should another source deliver the other.
function comparable(text) {
  return text.normalize('NFC').toLowerCase()
}

// True if every word of filterText appears somewhere in the title, the authors or a tag
// of the book, also inside a longer word: "physik" finds "Astrophysik".
// An empty filterText matches every book.
export function matchesFilter(book, filterText) {
  const words = comparable(filterText)
    .split(/\s+/)
    .filter((word) => word !== '')
  // The fields are joined with line breaks, so a typed word (which has no spaces)
  // cannot match across the end of the title and the start of the authors.
  const searchable = comparable([book.title ?? '', book.authors ?? '', ...book.tags].join('\n'))
  return words.every((word) => searchable.includes(word))
}
