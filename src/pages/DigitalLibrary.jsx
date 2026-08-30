import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Heart,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

const books = [
  {
    id: 1,
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    category: "Fiction",
    availability: "Available",
    color: "emerald",
    code: "SG",
    rating: 4.8,
    description:
      "A timeless story about friendship, discovery, healing, and a forgotten garden brought back to life.",
  },
  {
    id: 2,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    availability: "Available",
    color: "navy",
    code: "HT",
    rating: 4.9,
    description:
      "An accessible exploration of the universe, black holes, time, and the biggest questions in modern science.",
  },
  {
    id: 3,
    title: "The Story of Mathematics",
    author: "Richard Mankiewicz",
    category: "Mathematics",
    availability: "Issued",
    color: "orange",
    code: "M+",
    rating: 4.6,
    description:
      "Discover how mathematical ideas developed and transformed science, technology, art, and everyday life.",
  },
  {
    id: 4,
    title: "Pakistan: A Modern History",
    author: "Ian Talbot",
    category: "History",
    availability: "Available",
    color: "green",
    code: "PK",
    rating: 4.5,
    description:
      "A thoughtful introduction to Pakistan's history, society, institutions, and modern development.",
  },
  {
    id: 5,
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Fiction",
    availability: "Available",
    color: "purple",
    code: "LP",
    rating: 4.9,
    description:
      "A beautiful illustrated story about imagination, responsibility, friendship, love, and human nature.",
  },
  {
    id: 6,
    title: "Computer Science Essentials",
    author: "Saylani Smart School Publications",
    category: "Technology",
    availability: "Issued",
    color: "cyan",
    code: "</>",
    rating: 4.7,
    description:
      "A student-friendly introduction to programming, algorithms, computer systems, networks, and digital safety.",
  },
];

function DigitalLibrary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eduverse-library-favorites")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("eduverse-library-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const query = search.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);
      const matchesCategory =
        category === "All" ||
        book.category === category ||
        (category === "Favorites" && favorites.includes(book.id));
      return matchesSearch && matchesCategory;
    });
  }, [search, category, favorites]);

  const toggleFavorite = (id) => {
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((bookId) => bookId !== id)
        : [...favorites, id]
    );
  };

  if (selectedBook) {
    return (
      <main className="library-page">
        <div className="container book-detail-page">
          <button className="library-back" onClick={() => setSelectedBook(null)}>
            <ArrowLeft /> Back to Library
          </button>

          <section className="book-detail-card">
            <div className={`large-book-cover ${selectedBook.color}`}>
              <span>{selectedBook.code}</span>
              <BookOpen />
            </div>

            <div className="book-detail-information">
              <span className="library-label">{selectedBook.category}</span>
              <h1>{selectedBook.title}</h1>
              <p className="book-author">by {selectedBook.author}</p>

              <div className="book-rating">
                <Star /> <strong>{selectedBook.rating}</strong>
                <span>Student rating</span>
              </div>

              <p className="book-description">{selectedBook.description}</p>

              <div className="book-detail-meta">
                <div>
                  <small>AVAILABILITY</small>
                  <strong className={selectedBook.availability === "Available" ? "available" : "issued"}>
                    {selectedBook.availability}
                  </strong>
                </div>
                <div>
                  <small>FORMAT</small>
                  <strong>Printed Book</strong>
                </div>
                <div>
                  <small>LOCATION</small>
                  <strong>School Library</strong>
                </div>
              </div>

              <div className="book-detail-actions">
                <button
                  className="borrow-button"
                  disabled={selectedBook.availability !== "Available"}
                >
                  <Bookmark />
                  {selectedBook.availability === "Available"
                    ? "Reserve This Book"
                    : "Currently Issued"}
                </button>
                <button
                  className={`favorite-detail ${favorites.includes(selectedBook.id) ? "active" : ""}`}
                  onClick={() => toggleFavorite(selectedBook.id)}
                >
                  <Heart />
                  {favorites.includes(selectedBook.id)
                    ? "Saved to Favorites"
                    : "Add to Favorites"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="library-page">
      <section className="library-hero">
        <div className="container library-hero-grid">
          <div>
            <span className="task-label">TASK 04 · KNOWLEDGE CENTER</span>
            <h1>Your next great idea<br /><span>starts with a book.</span></h1>
            <p>
              Search the school collection, discover new subjects, and find
              books that inspire curiosity and lifelong learning.
            </p>

            <div className="library-main-search">
              <Search />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by book title or author..."
              />
              <button>Search</button>
            </div>
          </div>

          <div className="library-feature">
            <Sparkles />
            <span>BOOK OF THE WEEK</span>
            <h3>The Little Prince</h3>
            <p>A magical journey through friendship and imagination.</p>
          </div>
        </div>
      </section>

      <div className="container library-content">
        <section className="library-stats">
          <div><strong>1,200+</strong><span>Books Available</span></div>
          <div><strong>18</strong><span>Book Categories</span></div>
          <div><strong>{favorites.length}</strong><span>Your Favorites</span></div>
          <div><strong>08:00–16:00</strong><span>Library Hours</span></div>
        </section>

        <div className="library-heading">
          <div>
            <span className="library-label">EXPLORE THE COLLECTION</span>
            <h2>Popular books for students</h2>
          </div>
          <p>{filteredBooks.length} books found</p>
        </div>

        <div className="library-categories">
          {["All", "Fiction", "Science", "Mathematics", "History", "Technology", "Favorites"].map(
            (item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item === "Favorites" && <Heart />}
                {item}
              </button>
            )
          )}
        </div>

        <section className="book-grid">
          {filteredBooks.map((book) => (
            <article className="book-card" key={book.id}>
              <div className={`book-cover ${book.color}`}>
                <button
                  className={favorites.includes(book.id) ? "favorite active" : "favorite"}
                  onClick={() => toggleFavorite(book.id)}
                  aria-label="Save book"
                >
                  <Heart />
                </button>
                <span>{book.code}</span>
                <BookOpen />
              </div>

              <div className="book-card-content">
                <div className="book-card-top">
                  <span>{book.category}</span>
                  <span className={book.availability === "Available" ? "available" : "issued"}>
                    {book.availability}
                  </span>
                </div>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <div className="book-card-rating">
                  <Star /> {book.rating}
                </div>
                <button onClick={() => setSelectedBook(book)}>
                  View Book Details
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredBooks.length === 0 && (
          <div className="empty-state library-empty">
            <BookOpen />
            <h3>No books found</h3>
            <p>Try another title, author, or category.</p>
          </div>
        )}

        <section className="library-notice">
          <CheckCircle2 />
          <div>
            <strong>Student library reminder</strong>
            <p>Please return issued books on time so every student can enjoy them.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DigitalLibrary;

