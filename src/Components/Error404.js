import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="centered">
      <div className="list-books-title">
        <h1>404 - You're looking for something that doesn't exist</h1>
      </div>
      <Link className="button" to="/">
        <svg fill="#888888" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        <span>See MyReads</span>
      </Link>
    </div>
  );
};

export default Error404;
