import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class Books extends Component {
  render() {
    const { books, moveBook } = this.props;

    if (!books.length) {
      return <div>There are no books on this shelf</div>;
    }

    return (
      <ol className="books-grid">
        {books.map((book, key) => (
          <li key={key}>
            <Book {...book} moveBook={moveBook} />
          </li>
        ))}
      </ol>
    );
  }
}

Books.propTypes = {
  books: PropTypes.array.isRequired,
  moveBook: PropTypes.func.isRequired
};

export default Books;
