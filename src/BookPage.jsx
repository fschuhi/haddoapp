import { Fragment, useRef } from 'react'
import { isSwipeRight } from './swipe.js'
import { bookPageRows } from './bookPageRows.js'

// The book page: one book over the whole screen, above the grid. The cover at the top,
// then every field books.json has on the book (see bookPageRows.js), then the close button.
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
      {book.cover_file ? (
        // No loading="lazy" here: this one cover should load right away.
        <img className="book-page-cover" src={encodeURI(book.cover_file)} alt={book.title ?? ''} />
      ) : (
        <div className="book-page-cover book-page-no-cover" />
      )}
      {/* A description list: dt holds the caption, dd the value.
          Fragment groups each pair without adding an element, so dt and dd stay
          direct children of the dl, as its two-column grid needs. */}
      <dl className="book-page-rows">
        {bookPageRows(book).map((row) => (
          <Fragment key={row.caption}>
            <dt>{row.caption}</dt>
            <dd>{row.value}</dd>
          </Fragment>
        ))}
      </dl>
      <button type="button" className="book-page-close" onClick={onClose}>
        Schließen
      </button>
    </div>
  )
}
