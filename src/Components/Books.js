import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class Books extends Component {
  render() {
    const { books } = this.props;
    return (
      <ol className="books-grid">
        {books.map((book, key) => (
          <li key={key}>
            <Book {...book} />
          </li>
        ))}
      </ol>
    );
  }
}

Books.propTypes = {
  books: PropTypes.array.isRequired
};

export default Books;
