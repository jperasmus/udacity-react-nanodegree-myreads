import React from 'react';
import PropTypes from 'prop-types';

const Book = props => {
  const { title, authors, shelf, imageLinks: { thumbnail }, upsertBook } = props;

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 140,
            height: 200,
            backgroundImage: `url("${thumbnail}")`
          }}
        />
        <div className="book-shelf-changer">
          <svg fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10l5 5 5-5z" />
          </svg>
          <select
            value={shelf}
            onChange={e => {
              const target = e.target || e.srcElement;
              const { parentElement } = target;
              parentElement.classList.add('moving');

              upsertBook(props, shelf, e.target.value)
                .then(() => {
                  parentElement.classList.remove('moving');
                })
                .catch(() => {
                  parentElement.classList.remove('moving');
                });
            }}
          >
            <option value="none" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors.join(', ')}</div>
    </div>
  );
};

Book.defaultProps = {
  title: '',
  authors: [],
  shelf: 'none',
  imageLinks: {
    smallThumbnail: '',
    thumbnail: 'http://via.placeholder.com/128x193?text=No%20Image'
  }
};

Book.propTypes = {
  title: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
  shelf: PropTypes.string.isRequired,
  imageLinks: PropTypes.shape({
    smallThumbnail: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired
  }).isRequired,
  upsertBook: PropTypes.func.isRequired
};

export default Book;
