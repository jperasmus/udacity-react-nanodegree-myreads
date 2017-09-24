import React from 'react';
import { Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SearchBooks from './Components/SearchBooks';
import ListBooks from './Components/ListBooks';
import * as BooksAPI from './BooksAPI';
import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

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

    this.upsertBook = this.upsertBook.bind(this);
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
   * @description Move a book from one shelf to another or handle new books added.
   * @param {object} book
   * @param {string} oldShelf
   * @param {string} newShelf
   */
  upsertBook(book, oldShelf, newShelf, action = 'move') {
    const allBooks = this.state.currentlyReading.concat(this.state.wantToRead, this.state.read);
    const alreadyInMyReads = allBooks.find(shelfBook => shelfBook.id === book.id);

    if (action === 'move' || !alreadyInMyReads) {
      this.setState(state => {
        const updatedState = {
          [newShelf]: state[newShelf].concat([{ ...book, ...{ shelf: newShelf } }])
        };

        // When adding new books, they don't have an existing shelf
        if (oldShelf && oldShelf !== 'none') {
          updatedState[oldShelf] = state[oldShelf].filter(shelfBook => shelfBook.id !== book.id);
        }

        return updatedState;
      });

      BooksAPI.update(book, newShelf)
        .then(() => {
          toast.success(
            `Book successfully ${action === 'move' ? 'moved to shelf' : 'added to book list'}`
          );
        }) // All good, we've already optimistically moved the book to its new shelf
        .catch(() => {
          toast.error(
            `Book could not be ${action === 'move' ? 'moved to shelf' : 'added to book list'}`
          );

          // The update failed, we need to move the book back to its previous shelf
          this.setState(state => {
            const updatedState = {
              [oldShelf]: state[oldShelf].concat([{ ...book, ...{ shelf: oldShelf } }])
            };

            if (newShelf && newShelf !== 'none') {
              updatedState[newShelf] = state[newShelf].filter(
                shelfBook => shelfBook.id !== book.id
              );
            }

            return updatedState;
          });
        });
    } else {
      toast.warn('This book is already added!');
    }
  }

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => <ListBooks upsertBook={this.upsertBook} {...this.state} />}
        />
        <Route path="/search" render={() => <SearchBooks upsertBook={this.upsertBook} />} />
        <ToastContainer hideProgressBar={false} newestOnTop={true} />
      </div>
    );
  }
}

export default BooksApp;
