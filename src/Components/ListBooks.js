import React from 'react';
import { Link } from 'react-router-dom';
import ListBooksTitle from './ListBooksTitle';
import Bookshelf from './Bookshelf';

const ListBooks = props => {
  const {
    fetchingBooksFailed,
    fetchingBooks,
    currentlyReading,
    wantToRead,
    read,
    upsertBook
  } = props;
  let Content;

  if (fetchingBooksFailed) {
    Content = () => <div className="list-books-content-failed">Fetching the books failed...</div>;
  } else if (fetchingBooks) {
    Content = () => (
      <div className="list-books-content-loading">One second, quickly fetching the books...</div>
    );
  } else {
    Content = () => (
      <div>
        <Bookshelf title="Currently Reading" books={currentlyReading} upsertBook={upsertBook} />
        <Bookshelf title="Want to Read" books={wantToRead} upsertBook={upsertBook} />
        <Bookshelf title="Read" books={read} upsertBook={upsertBook} />
      </div>
    );
  }

  return (
    <div className="list-books">
      <ListBooksTitle title="MyReads" />
      <div className="list-books-content">
        <Content />
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
};

export default ListBooks;
