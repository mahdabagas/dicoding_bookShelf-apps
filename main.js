document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isSorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checkBook = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    checkBook
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  incompleteBook.innerHTML = "";

  const completeBook = document.getElementById("completeBookshelfList");
  completeBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      incompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;

  const action = document.createElement("div");
  action.classList.add("action");

  const textArticle = document.createElement("article");
  textArticle.classList.add("book_item");
  textArticle.append(textTitle, textAuthor, textYear, action);
  textArticle.setAttribute("id", "book-${bookObject.id}");

  if (bookObject.isCompleted == true) {
    const notDoneBook = document.createElement("button");
    notDoneBook.classList.add("green");
    notDoneBook.innerText = "Belum Selesai dibaca";

    notDoneBook.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const removeBook = document.createElement("button");
    removeBook.classList.add("red");
    removeBook.innerText = "Hapus Buku";

    removeBook.addEventListener("click", function () {
      removeBooks(bookObject.id);
    });

    action.append(notDoneBook, removeBook);
  } else {
    const doneBook = document.createElement("button");
    doneBook.classList.add("green");
    doneBook.innerText = "Selesai dibaca";

    doneBook.addEventListener("click", function () {
      booktoCompleted(bookObject.id);
    });

    const removeBook = document.createElement("button");
    removeBook.classList.add("red");
    removeBook.innerText = "Hapus Buku";

    removeBook.addEventListener("click", function () {
      removeBooks(bookObject.id);
    });

    action.append(doneBook, removeBook);
  }

  return textArticle;
}

function booktoCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBooks(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isSorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_DATA));
  }
}
const SAVED_DATA = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isSorageExist() {
  if (typeof Storage === undefined) {
    alert("browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_DATA, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
