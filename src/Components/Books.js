import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class Books extends Component {
  render() {
    const { books, upsertBook } = this.props;

    if (!books.length) {
      return <div>There are no books to display</div>;
    }

    return (
      <ol className="books-grid">
        {books.map((book, key) => (
          <li key={key}>
            <Book {...book} upsertBook={upsertBook} />
          </li>
        ))}
      </ol>
    );
  }
}

Books.propTypes = {
  books: PropTypes.array.isRequired,
  upsertBook: PropTypes.func.isRequired
};

export default Books;
