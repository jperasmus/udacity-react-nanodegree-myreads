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
      read: []
    };
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      // TODO: For a production app, refactor this so that each section does not need to iterate through all the books with the "filter"
      this.setState({
        currentlyReading: books.filter(book => book.shelf === 'currentlyReading'),
        wantToRead: books.filter(book => book.shelf === 'wantToRead'),
        read: books.filter(book => book.shelf === 'read')
      });
    });
  }

  render() {
    return (
      <div className="list-books">
        <ListBooksTitle title="MyReads" />
        <div className="list-books-content">
          <div>
            <Bookshelf title="Currently Reading" books={this.state.currentlyReading} />
            <Bookshelf title="Want to Read" books={this.state.wantToRead} />
            <Bookshelf title="Read" books={this.state.read} />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}

export default ListBooks;
