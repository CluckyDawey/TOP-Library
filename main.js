const myLibrary = [];
const THEME_STORAGE_KEY = 'top-library-theme';

function applyTheme(theme) {
  const body = document.body;
  const nightmodeToggle = document.getElementById('nightmode-toggle');

  if (theme === 'dark') {
    body.classList.add('dark');
    if (nightmodeToggle) {
      nightmodeToggle.textContent = 'Switch to Light Mode';
      nightmodeToggle.setAttribute('aria-pressed', 'true');
    }
  } else {
    body.classList.remove('dark');
    if (nightmodeToggle) {
      nightmodeToggle.textContent = 'Switch to Night Mode';
      nightmodeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(stored === 'dark' ? 'dark' : 'light');
}

class Book {
  #title;
  #author;
  #pages;
  #read;
  constructor(title, author, pages, read) {
      this.#title = title;
      this.#author = author;
      this.#pages = pages;
      this.#read = read;
  }

  get title() { return this.#title; }
  get author() { return this.#author; }
  get pages() { return this.#pages; }
  get read() { return this.#read; }

  toggleRead() {
    this.#read = !this.#read;
  }

  info() {
    return `${this.#title} by ${this.#author}, ${this.#pages} pages, ${this.#read ? 'read' : 'not read yet'}`;
  }
}

function addBookToLibrary(bookData) {
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const pagesInput = document.getElementById('pages');
  const readInput = document.getElementById('read');

  const title = bookData?.title ?? titleInput.value.trim();
  const author = bookData?.author ?? authorInput.value.trim();
  const pages = bookData?.pages ?? pagesInput.value.trim();
  const read = bookData?.read ?? readInput.checked;

  if (title && author && pages) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
    displayBooks();
    clearForm();
    return true;
  } else {
    alert('Please fill in all fields.');
    return false;
  }
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('pages').value = '';
  document.getElementById('read').checked = false;
}

function displayBooks() {
  const listContainer = document.getElementById('book-list');
  listContainer.innerHTML = '';

  if (myLibrary.length === 0) {
    listContainer.innerHTML = '<p>No books in your library yet. Add one!</p>';
    return;
  }

  myLibrary.forEach((book, index) => {
    const card = document.createElement('article');
    card.classList.add('book-card');

    let buttons = document.createElement('div');
    buttons.classList.add('book-buttons');

    let description = document.createElement('div');
    description.classList.add('book-description');

    let Title = document.createElement('h3');
    Title.classList.add('book-title');
    Title.textContent = book.title;
    card.appendChild(Title);

    let Author = document.createElement('p');
    Author.classList.add('book-author');
    Author.textContent = `Author: ${book.author}`;
    description.appendChild(Author);

    let Pages = document.createElement('p');
    Pages.classList.add('book-pages');
    Pages.textContent = `Pages: ${book.pages}`;
    description.appendChild(Pages);

    let Read = document.createElement('button');
    Read.classList.add('book-status');
    Read.textContent = `Status: ${book.read ? 'Read' : 'Not read yet'}`;
    buttons.appendChild(Read);

    let remove = document.createElement('button');
    remove.classList.add('book-remove');
    remove.textContent = 'Remove';
    remove.setAttribute('data-remove', index);
    buttons.appendChild(remove);

    card.appendChild(description);
    card.appendChild(buttons);

    Read.addEventListener('click', () => {
      book.toggleRead();
      displayBooks();
    });

    const removeBtn = card.querySelector('[data-remove]');
    removeBtn.addEventListener('click', () => {
      myLibrary.splice(index, 1);
      displayBooks();
    });

    listContainer.appendChild(card);
  });
}

function openModal() {
  const modal = document.getElementById('modal');
  modal.hidden = false;
  modal.classList.add('visible');
  document.getElementById('title').focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('visible');
  modal.hidden = true;
  clearForm();
}

function initUI() {
  const panel = document.getElementById('side-panel');
  const appGrid = document.querySelector('.app-grid');
  const toggle = document.getElementById('panel-toggle');
  const openAdd = document.getElementById('open-add-book');
  const nightmodeToggle = document.getElementById('nightmode-toggle');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('cancel-btn');
  const form = document.getElementById('add-book-form');

  loadTheme();

  if (nightmodeToggle) {
    nightmodeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  toggle.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    appGrid.classList.toggle('collapsed');
  });

  openAdd.addEventListener('click', () => openModal());
  closeBtn.addEventListener('click', () => closeModal());
  cancelBtn.addEventListener('click', () => closeModal());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('visible')) {
      closeModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (addBookToLibrary()) {
      closeModal();
    }
  });

  displayBooks();
}

window.addEventListener('DOMContentLoaded', initUI);
