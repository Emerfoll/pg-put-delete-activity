$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', deleteBook);
  $('#bookShelf').on('click', '.readBtn', markAsRead);

  // TODO - Add code for edit & delete buttons
}

function deleteBook() {
  console.log('Delete book.');
  let book = $(this).closest('tr').data('book').id;
  // let bookToDelete = book.id;
  console.log(book);

  $.ajax({
    type: 'DELETE',
    url: `/books/${book}`
  }).then(function (response) {
    refreshBooks();
  }).catch(function (error) {
    alert('Could not delete book.')
  })
}

function markAsRead() {
  console.log('Read');
  let book = $(this).closest('tr').data('book');
  let status = { status: book.status}
  // let bookStatus = book.status;
  console.log(status);

  $.ajax({
    type: 'PUT',
    url: `/books/${book.id}`,
    data: status
  }).then(function (response) {
    console.log('Updated');
    refreshBooks();
  }).catch(function (error) {
    alert('error updating status');
  })
}


function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<button class="readBtn">Mark as Read</button>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<button class="deleteBtn">Delete</button>`);
    $('#bookShelf').append($tr);
  }
}
