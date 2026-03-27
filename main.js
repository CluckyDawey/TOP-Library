const myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
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
    card.className = 'book-card';
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> ${book.read ? 'Read' : 'Not read yet'}</p>
      <button class="secondary-btn" data-remove="${index}">Remove</button>
    `;

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
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('cancel-btn');
  const form = document.getElementById('add-book-form');

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
