import { useRef } from 'react'
import { isSwipeRight } from './swipe.js'

// The book page: one book over the whole screen, above the grid.
// App draws it while a book is selected and gives it two props:
// - book: the tapped book, an object from books.json
// - onClose: called by the close button or a swipe to the right; App then removes the book page
export default function BookPage({ book, onClose }) {
  // Where the finger touched the screen, as { x, y }; null = no one-finger touch going on.
  // A ref, not state: remembering the point must not redraw the book page.
  const swipeStart = useRef(null)

  function handleTouchStart(event) {
    // Only one finger can swipe. With two fingers (pinch-zooming into the cover) nothing closes.
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      swipeStart.current = { x: touch.clientX, y: touch.clientY }
    } else {
      swipeStart.current = null
    }
  }

  function handleTouchEnd(event) {
    if (swipeStart.current === null) return
    const touch = event.changedTouches[0]
    const end = { x: touch.clientX, y: touch.clientY }
    if (isSwipeRight(swipeStart.current, end)) onClose()
    swipeStart.current = null
  }

  return (
    <div className="book-page" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <button type="button" className="book-page-close" onClick={onClose}>
        Schließen
      </button>
      <h1>{book.title}</h1>
    </div>
  )
}
