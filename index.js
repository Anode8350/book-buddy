const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const darkMode = document.getElementById('darkMode');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search term');
    return;
  }
  searchBooks(query);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

function searchBooks(query) {
  resultsDiv.innerHTML = 'Loading...';
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.docs.length === 0) {
        resultsDiv.innerHTML = 'No books found.';
        return;
      }
      displayBooks(data.docs);
    })
    .catch(err => {
      resultsDiv.innerHTML = 'Error fetching books.';
      console.error(err);
    });
}

function displayBooks(books) {
  resultsDiv.innerHTML = '';
  books.slice(0, 10).forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    const title = book.title || 'No title';
    const author = book.author_name ? book.author_name.join(', ') : 'Unknown author';

    bookDiv.innerHTML = `
      <div class="book-title">${title}</div>
      <div class="book-author">by ${author}</div>
    `;
    resultsDiv.appendChild(bookDiv);
  });
}

function updateDarkModeLabel() {
  const isDark = document.body.classList.contains('dark-mode');
  darkMode.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function setDarkMode(enabled) {
  // Add fade animation
  document.body.classList.add('fade-transition');

  setTimeout(() => {
    if (enabled) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
    updateDarkModeLabel();

    setTimeout(() => {
      document.body.classList.remove('fade-transition');
    }, 400);
  }, 100);
}

// Initialize dark mode based on saved preference
const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'enabled') {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

darkMode.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});
