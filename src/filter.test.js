import { describe, expect, test } from 'vitest'
import { matchesFilter } from './filter.js'

// Invented books only: this repo is public.
const konfliktmanagement = {
  title: 'Konfliktmanagement für Einsteiger',
  authors: 'Erika Mustermann',
  tags: ['Moderation'],
}
const manager = { title: 'Der Manager im Alltag', authors: 'Max Mustermann', tags: [] }
const sterne = { title: 'Sterne für alle', authors: 'Max Mustermann', tags: ['Astrophysik'] }
const ueberBuecher = { title: 'Über Bücher', authors: 'Erika Mustermann', tags: [] }

describe('matchesFilter', () => {
  test('an empty filter matches every book', () => {
    expect(matchesFilter(konfliktmanagement, '')).toBe(true)
    expect(matchesFilter(konfliktmanagement, '   ')).toBe(true)
  })

  test('finds a word in the title', () => {
    expect(matchesFilter(konfliktmanagement, 'Einsteiger')).toBe(true)
  })

  test('finds a word in the authors', () => {
    expect(matchesFilter(konfliktmanagement, 'Erika')).toBe(true)
  })

  test('finds a word in a tag', () => {
    expect(matchesFilter(konfliktmanagement, 'Moderation')).toBe(true)
  })

  test('ignores upper and lower case', () => {
    expect(matchesFilter(konfliktmanagement, 'einsteiger')).toBe(true)
    expect(matchesFilter(konfliktmanagement, 'ERIKA')).toBe(true)
  })

  test('finds part of a word', () => {
    // "manage" is in "Konfliktmanagement" and in "Manager"
    expect(matchesFilter(konfliktmanagement, 'manage')).toBe(true)
    expect(matchesFilter(manager, 'manage')).toBe(true)
    expect(matchesFilter(sterne, 'physik')).toBe(true)
  })

  test('several words must all match, each in any field', () => {
    // author and tag
    expect(matchesFilter(konfliktmanagement, 'erika moderation')).toBe(true)
    // author, tag and title
    expect(matchesFilter(sterne, 'max astrophysik sterne')).toBe(true)
  })

  test('a book does not match if one of several words is missing', () => {
    expect(matchesFilter(konfliktmanagement, 'erika physik')).toBe(false)
  })

  test('umlauts count as letters of their own', () => {
    expect(matchesFilter(ueberBuecher, 'Bücher')).toBe(true)
    expect(matchesFilter(ueberBuecher, 'Bucher')).toBe(false)
  })

  test('both stored forms of "ü" match each other', () => {
    // "u" followed by the separate dots character U+0308: looks like "ü", but is other text
    const uWithDots = 'u\u0308'
    expect(uWithDots).not.toBe('ü')
    const decomposedBook = { title: `B${uWithDots}cher`, authors: null, tags: [] }
    expect(matchesFilter(decomposedBook, 'Bücher')).toBe(true)
    expect(matchesFilter(ueberBuecher, `B${uWithDots}cher`)).toBe(true)
  })

  test('a book without title and authors does not break the filter', () => {
    const scannedBook = { title: null, authors: null, tags: [] }
    expect(matchesFilter(scannedBook, '')).toBe(true)
    expect(matchesFilter(scannedBook, 'erika')).toBe(false)
  })
})
