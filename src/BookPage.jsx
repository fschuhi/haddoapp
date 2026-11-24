// The book page: one book over the whole screen, above the grid.
// App draws it while a book is selected and gives it two props:
// - book: the tapped book, an object from books.json
// - onClose: called by the close button; App then removes the book page
export default function BookPage({ book, onClose }) {
  return (
    <div className="book-page">
      <button type="button" className="book-page-close" onClick={onClose}>
        Schließen
      </button>
      <h1>{book.title}</h1>
    </div>
  )
}
