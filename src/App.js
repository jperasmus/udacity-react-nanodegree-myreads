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
      none: [], // Search results
      fetchingBooks: true,
      fetchingBooksFailed: false,
      searchKeyword: '',
      searchingBooks: false,
      searchingBooksFailed: false
    };

    this.upsertBook = this.upsertBook.bind(this);
    this.searchForBooks = this.searchForBooks.bind(this);
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
  async upsertBook(book, oldShelf, newShelf) {
    const newBook = oldShelf === 'none';
    const removingBook = newShelf === 'none';
    const books = this.state[newShelf];
    const existAlready = books && books.find(shelfBook => shelfBook.id === book.id);

    if (!existAlready) {
      try {
        await BooksAPI.update(book, newShelf);
        this.setState(state => ({
          [newShelf]: state[newShelf].concat([{ ...book, ...{ shelf: newShelf } }]),
          [oldShelf]: state[oldShelf].filter(shelfBook => shelfBook.id !== book.id)
        }));

        const successMessage = `Book successfully ${newBook
          ? 'added to book list'
          : removingBook ? 'removed.' : 'moved to shelf'}`;

        toast.success(successMessage);
      } catch (error) {
        toast.error(`Book could not be ${!newBook ? 'moved to shelf' : 'added to book list'}`);
      }
    } else {
      toast.warn('This book is already added!');
    }
  }

  /**
   * @description Takes in a keyword to search for, makes a network request to find books matching the keyword.
   * @param {string} searchKeyword
   * @returns {promise} Sets the app state based on search results
   */
  async searchForBooks(searchKeyword) {
    // Not handling the event where the keyword is empty because we're defaulting to an empty array below

    this.setState({
      searchingBooks: true,
      searchingBooksFailed: false,
      searchKeyword
    });

    try {
      const response = await BooksAPI.search(searchKeyword, 10); // NOTE: The search maxResults property doesn't actually do anything, always defaults to 20
      const results = Array.isArray(response) ? response : [];
      const allBookIDs = this.state.currentlyReading
        .concat(this.state.wantToRead, this.state.read)
        .map(book => book.id);

      this.setState({
        none: results.filter(book => !allBookIDs.includes(book.id)),
        searchingBooks: false
      });
    } catch (error) {
      this.setState({ none: [], searchingBooks: false, searchingBooksFailed: true });
      toast.error('Searching books failed!');
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
        <Route
          path="/search"
          render={() => (
            <SearchBooks
              upsertBook={this.upsertBook}
              searchForBooks={this.searchForBooks}
              {...this.state}
            />
          )}
        />
        <ToastContainer hideProgressBar={false} newestOnTop={true} />
      </div>
    );
  }
}

export default BooksApp;
