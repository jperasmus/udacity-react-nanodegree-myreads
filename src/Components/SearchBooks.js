import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import Bookshelf from './Bookshelf';

class SearchBooks extends Component {
  // eslint-disable-next-line no-undef
  handleInputChange = debounce(keyword => {
    this.props.searchForBooks(keyword);
  }, 250);

  render() {
    let Results;
    const {
      upsertBook,
      currentlyReading,
      wantToRead,
      read,
      none,
      searchKeyword,
      searchingBooks,
      searchingBooksFailed
    } = this.props;

    if (searchingBooksFailed) {
      Results = () => (
        <div className="search-books-results-meta">
          Searching for <em>"{searchKeyword}"</em> failed :(
        </div>
      );
    } else if (searchingBooks) {
      Results = () => (
        <div className="search-books-results-meta">
          Searching for books matching <em>"{searchKeyword}"</em>
        </div>
      );
    } else {
      Results = () => <Bookshelf title="Available Books" books={none} upsertBook={upsertBook} />;
    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              defaultValue={searchKeyword}
              onChange={({ target: { value } }) => this.handleInputChange(value)}
              autoFocus
            />
          </div>
        </div>
        <div className="search-books-results">
          <Results />
          <Bookshelf title="Currently Reading" books={currentlyReading} upsertBook={upsertBook} />
          <Bookshelf title="Want to Read" books={wantToRead} upsertBook={upsertBook} />
          <Bookshelf title="Read" books={read} upsertBook={upsertBook} />
        </div>
      </div>
    );
  }
}

SearchBooks.propTypes = {
  upsertBook: PropTypes.func.isRequired,
  searchForBooks: PropTypes.func.isRequired,
  currentlyReading: PropTypes.array.isRequired,
  wantToRead: PropTypes.array.isRequired,
  read: PropTypes.array.isRequired,
  none: PropTypes.array.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  searchingBooks: PropTypes.bool.isRequired,
  searchingBooksFailed: PropTypes.bool.isRequired
};

export default SearchBooks;
