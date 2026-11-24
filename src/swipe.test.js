import { describe, expect, test } from 'vitest'
import { isSwipeRight, SWIPE_MIN_DISTANCE } from './swipe.js'

describe('isSwipeRight', () => {
  const start = { x: 100, y: 300 }

  test('a clear swipe to the right', () => {
    expect(isSwipeRight(start, { x: 250, y: 310 })).toBe(true)
  })

  test('exactly the minimum distance counts', () => {
    expect(isSwipeRight(start, { x: 100 + SWIPE_MIN_DISTANCE, y: 300 })).toBe(true)
  })

  test('one pixel short does not count', () => {
    expect(isSwipeRight(start, { x: 100 + SWIPE_MIN_DISTANCE - 1, y: 300 })).toBe(false)
  })

  test('a swipe to the left does not count', () => {
    expect(isSwipeRight(start, { x: -50, y: 300 })).toBe(false)
  })

  test('mostly downwards, like scrolling, does not count', () => {
    // 100 to the right, but 200 down: more scrolling than swiping
    expect(isSwipeRight(start, { x: 200, y: 500 })).toBe(false)
  })
})
