// Swipe detection for the book page: did the finger move clearly to the right?

// How far the finger must move to the right, in pixels: about a quarter of the iPhone's width.
export const SWIPE_MIN_DISTANCE = 80

// start and end are the points where the finger touched the screen and where it let go,
// each as { x, y } in pixels (x grows to the right, y grows downwards).
// True if the finger moved at least SWIPE_MIN_DISTANCE to the right, and at least twice as
// far sideways as up or down, so that scrolling down a long book page never counts.
export function isSwipeRight(start, end) {
  const sideways = end.x - start.x
  const upOrDown = Math.abs(end.y - start.y)
  return sideways >= SWIPE_MIN_DISTANCE && sideways >= 2 * upOrDown
}
