import { describe, expect, test } from 'vitest'
import { bookPageRows } from './bookPageRows.js'

// Invented books only: this repo is public.
// Read through JSON.parse, as the app reads books.json, so "position": 2.0 becomes the number 2.
const ueberBuecher = JSON.parse(`{
  "book_id": 1,
  "isbn13": "9780000000002",
  "title": "Über Bücher",
  "authors": "Erika Mustermann",
  "room": "Magazin",
  "space_label": "rack 02",
  "bin_label": "box 01",
  "position": 2.0,
  "tags": ["Mathematik", "Physik"],
  "cover_file": "covers/1234567890.jpg"
}`)

describe('bookPageRows', () => {
  test('a full book: rows in books.json order, with German captions, without book_id and cover_file', () => {
    expect(bookPageRows(ueberBuecher)).toEqual([
      { caption: 'ISBN', value: '9780000000002' },
      { caption: 'Titel', value: 'Über Bücher' },
      { caption: 'Autoren', value: 'Erika Mustermann' },
      { caption: 'Raum', value: 'Magazin' },
      { caption: 'Regal', value: '02' },
      { caption: 'Fach', value: '01' },
      { caption: 'Position', value: '2' },
      { caption: 'Tags', value: 'Mathematik, Physik' },
    ])
  })

  test('empty fields are left out', () => {
    // freshly scanned: an ISBN and a location, but nothing from ISBNdb, no tags, no cover
    const scannedBook = {
      book_id: 3,
      isbn13: '9780000000019',
      title: null,
      authors: '',
      room: 'Magazin',
      space_label: 'rack 01',
      bin_label: 'box 01',
      position: 1,
      tags: [],
      cover_file: null,
    }
    expect(bookPageRows(scannedBook)).toEqual([
      { caption: 'ISBN', value: '9780000000019' },
      { caption: 'Raum', value: 'Magazin' },
      { caption: 'Regal', value: '01' },
      { caption: 'Fach', value: '01' },
      { caption: 'Position', value: '1' },
    ])
  })

  test('tags are joined with ", "', () => {
    expect(bookPageRows({ tags: ['Astrophysik', 'Moderation', 'Zoologie'] })).toEqual([
      { caption: 'Tags', value: 'Astrophysik, Moderation, Zoologie' },
    ])
  })

  test('a field without a caption shows its key from books.json', () => {
    expect(bookPageRows({ publisher: 'Beispielverlag' })).toEqual([
      { caption: 'publisher', value: 'Beispielverlag' },
    ])
  })

  test('a rack or box label without digits stays unchanged', () => {
    expect(bookPageRows({ space_label: 'cupboard A', bin_label: null })).toEqual([
      { caption: 'Regal', value: 'cupboard A' },
    ])
  })
})
