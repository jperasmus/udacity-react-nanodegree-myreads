import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListBooksTitle from './ListBooksTitle';
import Bookshelf from './Bookshelf';
import * as BooksAPI from '../BooksAPI';

class ListBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: [],
      fetchingBooks: true,
      fetchingBooksFailed: false
    };

    this.moveBook = this.moveBook.bind(this);
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then(books => {
        // TODO: For a production app, refactor this so that each section does not need to iterate through all the books with the "filter"
        this.setState({
          currentlyReading: books.filter(book => book.shelf === 'currentlyReading'),
          wantToRead: books.filter(book => book.shelf === 'wantToRead'),
          read: books.filter(book => book.shelf === 'read'),
          fetchingBooks: false
        });
      })
      .catch(() => {
        this.setState({
          fetchingBooksFailed: true
        });
      });
  }

  /**
   * @description Move a book from one shelf to another.
   * @param {object} book
   * @param {string} oldShelf
   * @param {string} newShelf
   */
  moveBook(book, oldShelf, newShelf) {
    this.setState(state => ({
      [oldShelf]: state[oldShelf].filter(shelfBook => shelfBook.id !== book.id),
      [newShelf]: state[newShelf].concat([{ ...book, ...{ shelf: newShelf } }])
    }));

    BooksAPI.update(book, newShelf)
      .then(() => {
        // All good, we've already optimistically moved the book to its new shelf
      })
      .catch(() => {
        // The update failed, we need to move the book back to its previous shelf
        this.setState(state => ({
          [newShelf]: state[newShelf].filter(shelfBook => shelfBook.id !== book.id),
          [oldShelf]: state[oldShelf].concat([{ ...book, ...{ shelf: oldShelf } }])
        }));
      });
  }

  render() {
    let Content = null;

    if (this.state.fetchingBooksFailed) {
      Content = () => <div className="list-books-content-failed">Fetching the books failed...</div>;
    } else if (this.state.fetchingBooks) {
      Content = () => (
        <div className="list-books-content-loading">One second, quickly fetching the books...</div>
      );
    } else {
      Content = () => (
        <div>
          <Bookshelf
            title="Currently Reading"
            books={this.state.currentlyReading}
            moveBook={this.moveBook}
          />
          <Bookshelf title="Want to Read" books={this.state.wantToRead} moveBook={this.moveBook} />
          <Bookshelf title="Read" books={this.state.read} moveBook={this.moveBook} />
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
