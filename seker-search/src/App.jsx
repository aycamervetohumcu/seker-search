import { useState } from 'react';

const defaultSuggestions = [
  'How to design',
  'How to work hard',
  'How to choose font',
  'How to choose color palette'
];

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    
    if (value) {
      const filtered = defaultSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(defaultSuggestions);
    }
  };

  const searchBooks = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchInput)}`
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]);
    searchBooks();
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Seker</div>
        <nav className="nav-links">
          <a href="#">Images</a>
          <a href="#">Videos</a>
          <a href="#">Maps</a>
          <a href="#">News</a>
          <a href="#">Product</a>
          <a href="#">Sign in</a>
        </nav>
      </header>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="How to design..."
            value={searchInput}
            onChange={handleInputChange}
          />
          <button className="search-button" onClick={searchBooks}>
            Search
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="results">
        {results.map((book, index) => (
          <div key={index} className="book-card">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || '/api/placeholder/200/200'}
              alt={book.volumeInfo.title}
              className="book-image"
            />
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;