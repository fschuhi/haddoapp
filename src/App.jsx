import { useEffect, useState } from 'react'
import './App.css'
import { formatLocation } from './format.js'

// The app is read-only: everything it shows comes from books.json, which
// `make export` writes into public/, next to the covers/ and photos/ folders.
// The address is relative, so the app finds it next to index.html wherever
// it is served from (Mac or NAS).
const BOOKS_URL = 'books.json'

export default function App() {
  // null = not loaded yet; afterwards the list of books from books.json
  const [books, setBooks] = useState(null)
  const [error, setError] = useState(null)

  // Load books.json once, when the page opens. Loading it at runtime (instead
  // of building it into the app) means an update is just a new books.json.
  useEffect(() => {
    fetch(BOOKS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`${BOOKS_URL}: ${response.status}`)
        return response.json()
      })
      .then(setBooks)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="message">Bücher konnten nicht geladen werden ({error})</p>
  if (!books) return <p className="message">Lade Bücher...</p>

  return (
    <main>
      <h1>Unsere Bücher ({books.length})</h1>
      <ul className="shelf">
        {books.map((book) => (
          <li key={book.book_id} className="book">
            {book.cover_file ? (
              // encodeURI turns the spaces in photo file names into %20.
              // loading="lazy": the browser only fetches covers near the screen.
              <img
                className="cover"
                src={encodeURI(book.cover_file)}
                alt={book.title ?? ''}
                loading="lazy"
              />
            ) : (
              <div className="cover no-cover" />
            )}
            <p className="title">{book.title}</p>
            {/* As in the Excel bookshelf sheet: ISBN (if known) and location, then tags */}
            <p className="details">
              {book.isbn13 && <span className="isbn">{book.isbn13}</span>}
              <span className="location">{formatLocation(book)}</span>
            </p>
            {book.tags.length > 0 && <p className="tags">{book.tags.join(', ')}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}
