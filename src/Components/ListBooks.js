import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListBooksTitle from './ListBooksTitle';
import Bookshelf from './Bookshelf';

class ListBooks extends Component {
  render() {
    const {
      fetchingBooksFailed,
      fetchingBooks,
      currentlyReading,
      wantToRead,
      read,
      moveBook
    } = this.props;
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
          <Bookshelf title="Currently Reading" books={currentlyReading} moveBook={moveBook} />
          <Bookshelf title="Want to Read" books={wantToRead} moveBook={moveBook} />
          <Bookshelf title="Read" books={read} moveBook={moveBook} />
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
  }
}

export default ListBooks;
