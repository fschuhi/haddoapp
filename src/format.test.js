import { describe, expect, test } from 'vitest'
import { formatLocation } from './format.js'

describe('formatLocation', () => {
  test('keeps only the digits of rack and box', () => {
    const book = { space_label: 'rack 01', bin_label: 'box 01', position: 17 }
    expect(formatLocation(book)).toBe('01 / 01 (17)')
  })

  test('shows a whole-number position without decimals', () => {
    // books.json says 1.0; reading the JSON turns it into the number 1
    const book = JSON.parse('{"space_label": "rack 03", "bin_label": "box 12", "position": 1.0}')
    expect(formatLocation(book)).toBe('03 / 12 (1)')
  })

  test('shows "-" for a missing part', () => {
    expect(formatLocation({ space_label: 'rack 03', bin_label: null, position: 3 })).toBe(
      '03 / - (3)'
    )
    expect(formatLocation({ space_label: null, bin_label: null, position: null })).toBe('- / - (-)')
  })

  test('keeps a label without digits unchanged', () => {
    const book = { space_label: 'cupboard A', bin_label: null, position: 3 }
    expect(formatLocation(book)).toBe('cupboard A / - (3)')
  })
})
