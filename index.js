const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const darkMode = document.getElementById('darkMode');

// ✅ Direct API URL without CORS proxy
const API_URL = 'https://book-buddy-3.onrender.com/posts';

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
      if (!data.docs || data.docs.length === 0) {
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
      <button class="save-btn">Save</button>
    `;

    bookDiv.querySelector('.save-btn').addEventListener('click', () => {
      saveBookToServer({ title, author });
    });

    resultsDiv.appendChild(bookDiv);
  });
}

function saveBookToServer(book) {
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to save');
    return res.json();
  })
  .then(data => {
    alert('✅ Book saved to server!');
    console.log('Saved:', data);
  })
  .catch(err => {
    alert('❌ Error saving book.');
    console.error(err);
  });
}

// 🌙 Dark Mode
function updateDarkModeLabel() {
  const isDark = document.body.classList.contains('dark-mode');
  darkMode.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function setDarkMode(enabled) {
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

const savedMode = localStorage.getItem('darkMode');
setDarkMode(savedMode === 'enabled');

darkMode.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});
