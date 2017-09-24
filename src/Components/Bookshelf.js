import React from 'react';
import PropTypes from 'prop-types';
import Books from './Books';

const Bookshelf = props => {
  const { title, books, upsertBook } = props;

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <Books books={books} upsertBook={upsertBook} />
      </div>
    </div>
  );
};

Bookshelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  upsertBook: PropTypes.func.isRequired
};

export default Bookshelf;
