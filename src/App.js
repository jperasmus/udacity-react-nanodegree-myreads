import React from 'react';
import { Route } from 'react-router-dom';
import SearchBooks from './Components/SearchBooks';
import ListBooks from './Components/ListBooks';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
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
    this.setState(state => {
      const updatedState = {
        [newShelf]: state[newShelf].concat([{ ...book, ...{ shelf: newShelf } }])
      };

      // When adding new books, they don't have an existing shelf
      if (oldShelf) {
        updatedState[oldShelf] = state[oldShelf].filter(shelfBook => shelfBook.id !== book.id);
      }

      return updatedState;
    });

    BooksAPI.update(book, newShelf)
      .then(() => {}) // All good, we've already optimistically moved the book to its new shelf
      .catch(() => {
        // The update failed, we need to move the book back to its previous shelf
        this.setState(state => {
          const updatedState = {
            [oldShelf]: state[oldShelf].concat([{ ...book, ...{ shelf: oldShelf } }])
          };

          if (newShelf) {
            updatedState[newShelf] = state[newShelf].filter(shelfBook => shelfBook.id !== book.id);
          }

          return updatedState;
        });
      });
  }

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => <ListBooks moveBook={this.moveBook} {...this.state} />}
        />
        <Route path="/search" render={() => <SearchBooks moveBook={this.moveBook} />} />
      </div>
    );
  }
}

export default BooksApp;
