import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import Books from './Books';
import { search } from '../BooksAPI';

class SearchBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      count: 0,
      keyword: '',
      searching: false,
      searchFailed: false
    };
  }

  // eslint-disable-next-line no-undef
  handleInputChange = debounce(keyword => {
    // Not handling the event where the keyword is empty because we're defaulting to an empty array below

    this.setState({
      searching: true,
      searchFailed: false,
      keyword
    });

    search(keyword, 10) // NOTE: The search maxResults property doesn't actually do anything, always defaults to 20
      .then(response => {
        const results = Array.isArray(response) ? response : [];
        const count = results.length;
        this.setState({ results, count, searching: false });
      })
      .catch(() => {
        this.setState({ results: [], count: 0, searching: false, searchFailed: true });
        toast.error('Searching books failed!');
      });
  }, 250);

  render() {
    let Results;

    if (this.state.searchFailed) {
      Results = () => (
        <div className="search-books-results-meta">
          Searching for <em>"{this.state.keyword}"</em> failed :(
        </div>
      );
    } else if (this.state.searching) {
      Results = () => (
        <div className="search-books-results-meta">
          Searching for books matching <em>"{this.state.keyword}"</em>
        </div>
      );
    } else {
      Results = () => {
        return this.state.keyword && this.state.count ? (
          <div>
            <div className="search-books-results-meta">
              Displaying {this.state.count} books for <em>"{this.state.keyword}"</em>
            </div>
            <Books books={this.state.results} upsertBook={this.props.upsertBook} />
          </div>
        ) : (
          <div className="search-books-results-meta">No books to display</div>
        );
      };
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
              onChange={({ target: { value } }) => this.handleInputChange(value)}
              autoFocus
            />
          </div>
        </div>
        <div className="search-books-results">
          <Results />
        </div>
      </div>
    );
  }
}

export default SearchBooks;
