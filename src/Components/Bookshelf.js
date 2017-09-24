import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Books from './Books';

class Bookshelf extends Component {
  render() {
    const { title, books, upsertBook } = this.props;
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{title}</h2>
        <div className="bookshelf-books">
          <Books books={books} upsertBook={upsertBook} />
        </div>
      </div>
    );
  }
}

Bookshelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  upsertBook: PropTypes.func.isRequired
};

export default Bookshelf;
